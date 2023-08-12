const express = require("express");
const body_parser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const events_modal = require("./models/events");
const user_modal = require("./models/users")

const app = express();
app.use(body_parser.json());

app.use(
  `/graphql`,
  graphqlHTTP({
    schema: buildSchema(`
  type Event{
    _id: ID!
    title : String!
    description : String!
    price : Float!
    date : String!
  }

  type User{
    _id :ID!
    email: String!
    password : String
  }

  input EventInput{
    title : String!
    description : String!
    price : Float!
    date : String!
  }

  input UserInput{
    email: String!
    password :String!
  }
  type RootQuery{
    events: [Event!]! 
  }

  type RootMutation{
    createEvent(eventInput : EventInput) : Event
    createUser(userInput : UserInput) : User
  }
  schema{
    query:RootQuery
    mutation:RootMutation
  }
  `),
    rootValue: {
      events: () => {
        return events_modal
          .find()
          .then((result) => {
            return result.map((item) => {
              return { ...item._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new events_modal({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "64d720ec305cbdb3dfed18c5"
        });
        let created_event
        return event
          .save()
          .then((result) => {
            created_event = { ...result._doc, _id:result._doc._id.toString() };
            return user_modal.findById("64d720ec305cbdb3dfed18c5")
          })
          .then((user)=>{
            if (user.length==0){
              throw new Error("User Not Found")
            }
            user.created_events.push(event)
            return user.save()
          })
          .then(result=>{
            return created_event
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
      createUser: (args) => {
        return user_modal.find({email:args.userInput.email})
        .then(user=>{
          if (user.length>0){
            throw new Error("User Already Exist")
          }
          return bcrypt.hash(args.userInput.password, 12)
        })
        .then((hashedPassword) => {
          const user = new user_modal({
            email: args.userInput.email,
            password: hashedPassword
          })
          return user.save()
        }).then((result)=>{
          return{...result._doc, password:null, _id:result.id}
        })
          .catch((err) => {
            throw err
          })
      }
    },
    graphiql: true,
  })
);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

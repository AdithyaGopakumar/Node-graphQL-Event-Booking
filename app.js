const express = require("express");
const body_parser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const events_modal = require("./models/events");

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

  input EventInput{
    title : String!
    description : String!
    price : Float!
    date : String!
  }

  type RootQuery{
    events: [Event!]! 
  }

  type RootMutation{
    createEvent(eventInput : EventInput) : Event
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
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
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

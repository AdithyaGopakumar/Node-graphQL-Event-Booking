const express = require("express")
const body_parser = require("body-parser")
const {graphqlHTTP} = require("express-graphql")
const { buildSchema } = require("graphql")

const app = express()
app.use(body_parser.json())

app.use(`/graphql`,graphqlHTTP({
  schema:buildSchema(`
  type RootQuery{
    events: [String!]!
  }
  type RootMutation{
    createEvent(name: String):String
  }
  schema{
    query:RootQuery
    mutation:RootMutation
  }
  `),
  rootValue:{
    events:()=>{
      return ["Romantic","Fun","Cooking","AllNightCoding"]
    },
    createEvent:(args)=>{
      const eventName =args.name
      return eventName
    }
  },
  graphiql:true
}))

app.listen(5000)
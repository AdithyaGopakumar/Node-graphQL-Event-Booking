const express = require("express");
const body_parser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const graphQLSchema = require("./graphQl/schema/index")
const graphQLResolver = require("./graphQl/resolvers/index")
const isAuthorized = require("./middleware/authMiddleware")

const app = express();
app.use(body_parser.json());

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization")
  if(req.method === "OPTIONS"){
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuthorized)

app.use(
  `/graphql`,
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true,
  })
);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Connected to MongoDB @ ${MONGO_URL}`);
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

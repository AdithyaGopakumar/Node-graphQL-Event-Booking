const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type Booking{
    _id: ID!
    event_id : Event!
    user_id : User!
    createdAt : String!
    updatedAt : String!
  }

  type Event{
    _id: ID!
    title : String!
    description : String!
    price : Float!
    date : String!
    creator : User!
  }

  type User{
    _id :ID!
    email: String!
    password : String
    createdEvents : [Event!]
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

  type CancellationResult{
    event : Event
    message : String
  }

  type AuthData {
    user_id : ID!
    token : String!
    tokenExpiration : Int!
  }

  type RootQuery{
    events: [Event!]! 
    bookings: [Booking!]!
    login(email:String!,password:String!):AuthData!
  }

  type RootMutation{
    createEvent(eventInput : EventInput) : Event
    createUser(userInput : UserInput) : User
    bookEvent(event_id : ID!) : Booking
    cancelBooking(booking_id : ID!) : CancellationResult
  }

  schema{
    query:RootQuery
    mutation:RootMutation
  }
  `)
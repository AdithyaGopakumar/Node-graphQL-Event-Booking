const events_modal = require("../../models/events");
const user_modal = require("../../models/users")
const bcrypt = require('bcryptjs')

// populating Events
const events = async (eventsIds) => {
  try {
    const events = await events_modal.find({ _id: { $in: eventsIds } })
    events.map((item) => {
      return {
        ...item._doc,
        _id: item.id,
        date: new Date(item._doc.date).toISOString(),
        creator: user.bind(this, item.creator)
      }
    })
    return events
  } catch (err) {
    throw err
  }
}

// populating Users
const user = async (userId) => {
  try {
    const user = await user_modal.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.created_events)
    }
  } catch (err) {
    throw err
  }
}

module.exports = {

  // List out all the events
  events: async () => {
    try {
      const events = await events_modal.find()
      return events.map((item) => {
        return {
          ...item._doc,
          _id: item.id,
          date: new Date(item._doc.date).toISOString(),
          creator: user.bind(this, item._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },

  // Create Event
  createEvent: async (args) => {
    const event = new events_modal({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "64d720ec305cbdb3dfed18c5"
    });
    let created_event
    try {
      const result = await event.save()
      created_event = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(result._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const userData = await user_modal.findById("64d720ec305cbdb3dfed18c5")
      if (userData.length == 0) {
        throw new Error("User Not Found")
      }
      userData.created_events.push(event)
      await userData.save()
      return created_event
    } catch (err) {
      throw err;
    };
    return event;
  },

  // Create User
  createUser: async (args) => {
    try {
      const userExist = await user_modal.find({ email: args.userInput.email })
      if (userExist.length > 0) {
        throw new Error("User Already Exist")
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const user = new user_modal({
        email: args.userInput.email,
        password: hashedPassword
      })
      const result = await user.save()
      return { ...result._doc, password: null, _id: result.id }
    } catch (err) {
      throw err
    }
  }
}
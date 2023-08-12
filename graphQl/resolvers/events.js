const events_modal = require("../../models/events");
const user_modal = require("../../models/users");
const {user,single_event,events} =require("./helpers")

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
      creator: "64d7786f8f57adff24350313"
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
      const userData = await user_modal.findById("64d7786f8f57adff24350313")
      if (userData.length == 0) {
        throw new Error("User Not Found")
      }
      userData.created_events.push(event)
      await userData.save()
      return created_event
    } catch (err) {
      throw err;
    };
    // return event;
  },

}
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
  createEvent: async (args,req) => {
    if(!req.isAuthorized){
      throw new Error("Not Authorized")
    }
    const event = new events_modal({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.user_id
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
      const userData = await user_modal.findById(req.user_id)
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
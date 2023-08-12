const booking_modal = require("../../models/bookings");
const events_modal = require("../../models/events");
const {user,single_event,events} =require("./helpers")

module.exports = {
  // List out all the Bookings
  bookings: async () => {
    try {
      const bookings = await booking_modal.find()
      return bookings.map((item) => {
        return {
          ...item._doc,
          _id: item.id,
          user_id: user.bind(this, item.user_id),
          event_id: single_event.bind(this, item.event_id),
          createdAt: new Date(item._doc.createdAt).toISOString(),
          updatedAt: new Date(item._doc.updatedAt).toISOString(),
        }
      })
    } catch (err) {
      throw err;
    }
  },

  // Create Bookings
  bookEvent: async (args) => {
    try {
      const FetchedEvent = await events_modal.findOne({ _id: args.event_id })
    const booking = new booking_modal({
      event_id: FetchedEvent,
      user_id: "64d7786f8f57adff24350313"
    })
    const result = await booking.save()
    return {
      ...result._doc,
      _id: result.id,
      user_id: user.bind(this, result.user_id),
      event_id: single_event.bind(this, result.event_id._id),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    }
    } catch (err) {
      throw err
    }
    
  },
  
  // Cancel Bookings
  cancelBooking: async (args) => {
    try {
      const booking = await booking_modal.findById(args.booking_id).populate("event_id")
      const event = {
        ...booking.event_id._doc,
        _id:booking.event_id.id,
        creator: user.bind(this, booking.event_id._doc.creator),
      }
      await booking_modal.deleteOne({ _id: args.booking_id })
      return {
        event,
        message:"This event has been deleted successfully"
      }
    } catch (err) {
      throw err
    }
  }
}
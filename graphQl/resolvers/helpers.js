const user_modal = require("../../models/users")
const events_modal = require("../../models/events")

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

// populating a Event
const single_event = async (eventId) => {
  try {
    const event = await events_modal.findById(eventId)
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator)
    }
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
      password: null,
      createdEvents: events.bind(this, user._doc.created_events)
    }
  } catch (err) {
    throw err
  }
}

module.exports = { user, single_event, events }
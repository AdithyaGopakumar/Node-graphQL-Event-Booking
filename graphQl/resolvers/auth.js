const users = require("../../models/users");
const user_modal = require("../../models/users");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
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
  },

  // Login User
  login: async (args) => {
    try {
      const user = await user_modal.findOne({ email: args.email })
      if (!user) {
        throw new Error("User Does Not Exist")
      }
      const password_matches = await bcrypt.compare(args.password, user.password)
      if (!password_matches) {
        throw new Error("Password Incorrect")
      }
      const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.HASH_STRING, { expiresIn: "1h" })
      return {
        user_id: user.id, token: token, tokenExpiration: 1
      }
    } catch (err) {
      throw err
    }
  }
}
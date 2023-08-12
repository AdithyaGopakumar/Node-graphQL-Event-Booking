const user_modal = require("../../models/users");
const bcrypt = require('bcryptjs')

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
}
const asyncHandler = require('express-async-handler')
const User = require('../models/user.js')
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if(!name || !email || !password){
    res.status(400).json({ msg: "All fields are mandatory!"})
  }
  const userExists = await User.findOne({ email })

  if(userExists){
    res.status(400);
    throw new Error("User already exists!")
  }

  const newUser = await User.create({
    name,
    email,
    password,
    pic,
  })
  if(newUser){
    return res.status(201).json({ success: true, user: newUser })
  } else {
    res.status(400);
    throw new Error("Failed to create new user!");
  }
})
exports.loginUser = async (req, res) => {

}
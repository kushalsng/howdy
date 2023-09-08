const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken.js');
const User = require('../models/user.js')


exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if(!name || !email || !password){
    return res.status(400).json({ msg: "All fields are mandatory!"})
  }
  const userExists = await User.findOne({ email })

  if(userExists){
    return res.status(400).json({ msg: "User already exists!" })
  }
  const newUser = await User.create({
    name,
    email,
    password,
    userPic: pic,
  })
  if(!newUser){
    return res.status(400).json({ msg: "Failed to create new user!"})
  }
  return res.status(201).json({ success: true, user: newUser, token: generateToken(newUser._id) })
})

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ msg: "All fields are mandatory!"})
  }
  const user = await User.findOne({ email })
  if(!user) {
    return res.status(404).json({ msg: "User not found!"});
  }
  const isPasswordMatched = await user.matchPassword(password);
  if(!isPasswordMatched){
    return res.status(404).json({msg: "Incorrect Password!"});
  }
  return res.json({
    success: true,
    msg: "Logged in successfully",
    token: generateToken(user._id),
    user: user
  })
})
const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');
const generateToken = require('../config/generateToken.js');

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, pic } = req.body;

  if(!name || !email || !password || !confirmPassword){
    return res.status(400).json({ msg: "All fields are mandatory!"})
  }
  if(password !== confirmPassword){
    return res.status(400).json({ msg: `Passwords doesn't match!`})
  }
  const userExists = await User.findOne({ email })

  if(userExists){
    return res.status(400).json({ msg: "User already exists!" })
  }
  const newUser = await User.create({
    name,
    email,
    password,
    pic,
  })
  if(newUser){
    return res.status(201).json({ success: true, user: newUser, token: generateToken(newUser._id) })
  } else {
    return res.status(400).json({ msg: "Failed to create new user!"})
  }
})
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ msg: "All fields are mandatory!"})
  }
  const user = await User.findOne({ email });
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
    token: generateToken(user._id)
  })
})
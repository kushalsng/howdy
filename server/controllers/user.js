const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const userConditions = {
    _id: { $ne: req.user._id}
  }
  if(search && search.length){
    userConditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  }
  const users = await User.find(userConditions).sort('name')
  return res.json({
    success: true,
    users
  })
})
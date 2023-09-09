const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { search, limit } = req.query;
  const limitCount = parseInt(limit);
  const userConditions = {
    _id: { $ne: req.user._id}
  }
  if(search && search.length){
    userConditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  }
  const users = await User.find(userConditions).sort('name');
  return res.json({
    success: true,
    users: limitCount ? users.slice(0, limitCount) : users
  })
})
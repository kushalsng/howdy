const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return res.status(403).json({
      success: false,
      msg: 'Unauthorized Access!',
    });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized Access!',
      });
    }
    const user = await User.findById(verify.id).select('-password');
    req.user = user;
    next();
  } catch (err) {
    console.error('error while authorization: ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
      err,
    });
  }
});

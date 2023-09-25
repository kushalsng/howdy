const router = require('express').Router();
const {
  registerUser,
  loginUser,
  googleSignIn,
} = require('../controllers/auth');

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/google-signin').post(googleSignIn);

module.exports = router;

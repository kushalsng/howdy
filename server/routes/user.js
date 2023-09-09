const router = require('express').Router()
const {
  getAllUsers
} = require('../controllers/user')

router.route('/').get(getAllUsers);
// change profile picture
// change name

module.exports = router
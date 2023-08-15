const router = require('express').Router()
const {
  getAllUsers
} = require('../controllers/user')

router.route('/').get(getAllUsers);

module.exports = router
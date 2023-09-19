const router = require('express').Router()
const {
  sendMessage,
  getAllMessages
} = require('../controllers/message')

router.route('/').post(sendMessage);
router.route('/').get(getAllMessages);

module.exports = router
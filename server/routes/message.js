const router = require('express').Router()
const {
  sendMessage,
  getAllMessages
} = require('../controllers/message')

router.route('/').post(sendMessage);
router.route('/:chatId').get(getAllMessages);

module.exports = router
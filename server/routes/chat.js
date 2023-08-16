const router = require('express').Router();
const {
  fetchOrCreateChat,
  fetchChats,
  addGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup
} = require('../controllers/chat');

router.route('/').post(fetchOrCreateChat);
router.route('/').get(fetchChats);
router.route('/add-group-chat').post(addGroupChat);
router.route('/rename-group').put(renameGroup);
router.route('/add-group-user').post(addUserToGroup);
router.route('/remove-group-user').delete(removeUserFromGroup);


module.exports = router;

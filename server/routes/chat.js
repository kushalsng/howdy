const router = require('express').Router();
const {
  fetchOrCreateChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
  leaveGroup,
} = require('../controllers/chat');

router.route('/').post(fetchOrCreateChat);
router.route('/').get(fetchChats);
router.route('/create-group-chat').post(createGroupChat);
router.route('/rename-group').put(renameGroup);
router.route('/add-group-user').put(addUserToGroup);
router.route('/remove-group-user').put(removeUserFromGroup);
router.route('/leave-group').put(leaveGroup);

// remove from chat - only admin can do this.
// make admin - only admin can do this
// delete one-to-one chat
// delete group chat
// add group display picture

module.exports = router;

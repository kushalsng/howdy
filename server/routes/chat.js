const router = require('express').Router();
const {
  fetchOrCreateChat,
  fetchChats,
  addGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
  leaveGroup
} = require('../controllers/chat');

router.route('/').post(fetchOrCreateChat);
router.route('/').get(fetchChats);
router.route('/add-group-chat').post(addGroupChat);
router.route('/rename-group').put(renameGroup);
router.route('/add-group-user').put(addUserToGroup);
router.route('/remove-group-user').put(removeUserFromGroup);
// leave chat - all except admin can do this
router.route('/leave-group').put(leaveGroup);

// remove from chat - only admin can do this.
// make admin - only admin can do this
// delete one-to-one chat 
// delete group chat
// add group display picture


module.exports = router;

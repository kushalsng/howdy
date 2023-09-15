import { apis } from './api_helper';

export const fetchChats = async function () {
  return apis.get('/chat');
};
export const fetchOrCreateChat = async function (params) {
  return apis.post('/chat', params);
};
export const createGroupChat = async function (params) {
  return apis.post('/chat/create-group-chat', params);
};
export const renameGroup = async function (params) {
  return apis.put('/chat/rename-group', params);
};
export const addUserToGroup = async function (params) {
  return apis.put('/chat/add-group-user', params);
};
export const removeUserFromGroup = async function (params) {
  return apis.put('/chat/remove-group-user', params);
};
export const leaveGroup = async function (params) {
  return apis.put('/chat/leave-group', params);
};

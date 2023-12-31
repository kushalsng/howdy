import { apis } from './api_helper';

export const sendMessage = async function(params){
  return apis.post(`/message`, params);
}

export const getChatMessages = async function(chatId){
  return apis.get(`/message/${chatId}`);
}
import { apis } from './api_helper';

export const sendMessage = async function(params){
  return apis.post(`/message`, params);
}

export const getChatMessages = async function(chatId, skip, limit){
  return apis.get(`/message/${chatId}?skip=${skip ? skip : "0"}&limit=${limit ? limit : "50"}`);
}
import { apis } from './api_helper';

export const getAllUsers = async function(search, limit){
  return apis.get(`/user${search ? '?search='+ search : ""}${limit ? '&limit='+ limit : ""}`);
}
import { apis } from './api_helper';

export const getAllUsers = async function(search){
  return apis.get(`/user${search ? '?search='+ search : ""}`);
}
import { apis } from './api_helper';

export const getAllUsers = async function(){
  return apis.get(`/user/`);
}
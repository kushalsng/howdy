import { apis } from './api_helper';

export const register = async function(params){
  return apis.post(`/`, params);
} 
export const login = async function(params){
  return apis.post(`/login`, params);
} 
export const googleSignIn = async function(params){
  return apis.post(`/google-signin`, params);
} 
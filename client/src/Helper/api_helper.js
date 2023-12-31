import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL


axios.interceptors.request.use((request) => {
  request.baseURL = baseURL;
  request.headers['Content-type'] = 'application/json';
  const token = localStorage.getItem("token");
  if(token){
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

const get = async (url, requestParams = {}) => {
  return await axios.get(baseURL + url, requestParams);
};
const post = async (url, data, headers) => {
  if(headers) {
    axios.interceptors.request.use((request) => {
      request.headers['Content-type'] = 'multipart/form-data';
      return request;
    });
  }
  return await axios.post(baseURL + url, data);
};
const patch = async (url, data) => {
  return await axios.patch(url, data);
};
const put = async (url, data) => {
  return await axios.put(url, data);
}
const remove = async (url, data) => {
  return await axios.delete(url, data);
};

export const apis = {
  get,
  post,
  patch,
  put,
  remove,
};
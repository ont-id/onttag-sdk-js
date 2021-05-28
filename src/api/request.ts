import axios from "axios";
//http://45.43.63.208:8585
//http://192.168.1.115:8585
const service = axios.create({
  timeout: 60 * 1000, // request timeout
  headers: { "Content-Type": "application/json" },
  baseURL: 'http://45.43.63.208:8585'
});
// request interceptor
service.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    // if (response.headers.authorization) {
    //   setToken(response.headers.authorization)
    // }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;

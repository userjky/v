import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:9934",
  timeout: 5000,
});

request.interceptors.request.use(config=>{
    return config;
},e=>Promise.reject(e))

request.interceptors.response.use(res=>{
    return res;
},e=>Promise.reject(e))

export default request;
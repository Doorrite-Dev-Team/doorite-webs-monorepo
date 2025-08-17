import axios from "axios";
const Axios = axios.create({
  baseURL: process.env.API_URI
    ? `${process.env.API_URI}/api/v1`
    : "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

export default Axios;

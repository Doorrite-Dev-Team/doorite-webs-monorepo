import axios from "axios";

// This will show in your production logs
// console.log("Production NEXT_PUBLIC_API_URI:", process.env.NEXT_PUBLIC_API_URI);
// console.log("NODE_ENV:", process.env.NODE_ENV);

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI
    ? `${process.env.NEXT_PUBLIC_API_URI}/api/v1`
    : "http://localhost:4000/api/v1", // This fallback won't work in production
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

export default Axios;

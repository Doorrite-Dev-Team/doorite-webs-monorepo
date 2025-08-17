import axios from "axios"
const Axios = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 5 * 60 * 1000
})

export default Axios
import axios from "axios";
const api = axios.create({
  baseURL: "https://easypark-backend-u6wi.onrender.com/api",
});
export default api;
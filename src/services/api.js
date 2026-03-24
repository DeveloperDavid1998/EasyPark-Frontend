import axios from "axios";
const api = axios.create({
  baseURL: "https://easypark-backend-n1k1.onrender.com/api",
});
export default api;
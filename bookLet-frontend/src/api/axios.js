import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://booklett-production.up.railway.app/api",
});

export default apiClient;

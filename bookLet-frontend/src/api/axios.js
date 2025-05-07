import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://f2h32s33-5202.inc1.devtunnels.ms/api",
});

export default apiClient;

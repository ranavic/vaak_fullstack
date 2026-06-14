import axios from "axios";
import { getAccessToken, getSessionId } from "../utils/session";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

axiosClient.interceptors.request.use((config) => {
  config.headers["X-Session-Id"] = getSessionId();

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;

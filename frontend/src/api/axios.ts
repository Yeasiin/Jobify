import { apiEndPoint } from "@/utils/endpoint";
import axios from "axios";

// Public API instance (no token, for login/register)
export const publicApi = axios.create({ baseURL: apiEndPoint });

// Protected API instance (automatically includes token)
export const api = axios.create({ baseURL: apiEndPoint });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://student-management-system-pearl-six.vercel.app/" || "https://vercel.com/siddharth-singhs-projects-d45728b0/student-management-system/HaZpT9y4huhKYG26nvfbDA2hb35Y",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

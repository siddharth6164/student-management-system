// src/api/axios.js
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://vercel.com/siddharth-singhs-projects-d45728b0/student-management-system",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// src/utils/safeAxios.ts
import axios from "axios";

const safeAxios = axios.create({
  baseURL: "http://localhost:5000", // change if needed
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if you use cookies for auth
});

// Optional: Global error handling interceptor
safeAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling globally here
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error (${status}):`, data?.message || data);
    } else {
      console.error("Network/API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default safeAxios;

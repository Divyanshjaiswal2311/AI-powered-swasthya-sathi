/**
 * API Service Configuration
 * 
 * Clean production-ready Axios setup
 */

import axios from "axios";
import { toast } from "react-toastify";

// ✅ FIX 1: Add /api/v1 in base URL
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://ai-powered-swasthya-sathi.onrender.com/api/v1";

console.log("Using API Base URL:", BASE_URL);

/**
 * Axios Instance
 */
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ matches backend CORS
  timeout: 10000, // ✅ prevents Render timeout issues
});

/**
 * Request Interceptor
 */
API.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
API.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.error(
      "API Response Error:",
      error?.response?.data || error.message || error
    );

    // ✅ Ignore 401 (handled by UI)
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }

    // ✅ Ignore auth endpoint errors (handled in form)
    const requestPath = error.config?.url || "";
    if (
      requestPath.includes("/auth/login") ||
      requestPath.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // ✅ Network error handling (Render cold start etc.)
    if (error.code === "ERR_NETWORK") {
      toast.error("Server is waking up... please try again in a few seconds.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default API;

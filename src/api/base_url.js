import axios from "axios";
import Cookies from "js-cookie";

// Define the API Base URL from environment variables for production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.51:8001";
const REFRESH_ENDPOINT = "/api/token/refresh/";

// Create an axios instance
const baseApi = axios.create({
  baseURL: API_BASE_URL,
});

// A flag to prevent multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 1. Request Interceptor: Add Authorization Header ---
// Request interceptor: attach access token if present.
// If access token is missing but a refresh token exists, try to refresh first.
baseApi.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    // If there's no access token but we have a refresh token, attempt refresh
    if (!token && refreshToken) {
      // If another refresh is in progress, wait for it
      if (isRefreshing) {
        try {
          token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        isRefreshing = true;
        try {
          // Use plain axios with an absolute URL to avoid interceptor recursion
          const refreshResponse = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
            refresh: refreshToken,
          });

          const { access, refresh } = refreshResponse.data;

          Cookies.set("accessToken", access);
          Cookies.set("refreshToken", refresh);

          baseApi.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          processQueue(null, access);
          token = access;
        } catch (refreshError) {
          processQueue(refreshError);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          // Redirect to login if refresh fails
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- 2. Response Interceptor: Handle Token Expiration and Refresh ---
baseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized and the specific token expiration code
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid"
    ) {
      const refreshToken = Cookies.get("refreshToken");

      // If we don't have a refresh token or it's already a refresh request attempt, redirect
      if (!refreshToken || originalRequest._retry) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        // Redirect using location for Next.js consistency if not in a server component
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Add the request to the queue and wait if a refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // Mark as retried
      isRefreshing = true;

      try {
        // Use the baseApi instance for the refresh call
        const refreshResponse = await baseApi.post(REFRESH_ENDPOINT, {
          refresh: refreshToken,
        });

        const { access, refresh } = refreshResponse.data;

        Cookies.set("accessToken", access);
        Cookies.set("refreshToken", refresh);

        // Update header for the original request and any queued requests
        baseApi.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        processQueue(null, access);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError); // Reject all queued requests
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default baseApi;

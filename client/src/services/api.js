import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
      withCredentials: true,
});

// Request Interceptor 
api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
            config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
}, (error) => {
      return Promise.reject(error);
});

// Response Interceptor to handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh token endpoint itself returns 401
      // Also, skip refresh logic if the error comes from login or register
      if (
        originalRequest.url.includes("/auth/refresh-token") ||
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await api.post("/auth/refresh-token");
        const newAccessToken = response.data.data.accessToken;

        // Save new token and update header
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/"
        ) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
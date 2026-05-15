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
  (error) => {
    // Check if the error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear expired auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect to login page if we aren't already there
      if (
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        toast.error("Session expired. Please log in again.");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
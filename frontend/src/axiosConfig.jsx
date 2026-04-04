import axios from 'axios';

// 1. Create the instance
const axiosInstance = axios.create({
 // baseURL: 'http://localhost:5001',
  baseURL: 'http://3.107.204.217:5001',
  headers: { 'Content-Type': 'application/json' },
});

// 2. The Interceptor (Use the SAME name: axiosInstance)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // CRITICAL: Use backticks (`) here, NOT single quotes ('), 
    // so it actually uses the token value!
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Export the one you just configured
export default axiosInstance;

import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const privateClient = axios.create({
  baseURL: API_BASE_URL,
});

privateClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

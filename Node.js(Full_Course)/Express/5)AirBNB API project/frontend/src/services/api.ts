import axios from 'axios';

// The base instance for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Crucial for sending and receiving httpOnly cookies automatically
});

export default api;

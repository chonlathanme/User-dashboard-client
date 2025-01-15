import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
import axios from 'axios';

// Since this is for local development, we point to the backend's local URL
// In production, you would use an environment variable (e.g. import.meta.env.VITE_API_URL)
// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://saas-billing-app.onrender.com/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

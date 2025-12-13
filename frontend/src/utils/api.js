import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API,
});

// Add user_id to all requests
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('moodSyncUser') || 'null');
  if (user && user.id) {
    config.headers['X-User-Id'] = user.id;
  }
  return config;
});

export default apiClient;

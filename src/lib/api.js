import axios from 'axios';

// Vite exposes env vars through import.meta.env. Use VITE_API_URL as the public variable.
const RAW_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '';
const FALLBACK_BASE = 'http://localhost:4000';
const BASE = RAW_BASE || FALLBACK_BASE;
// If RAW_BASE is empty, consider API disabled in dev unless user runs backend
const API_ENABLED = !!RAW_BASE;

const API = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});
API.defaults.withCredentials = true; // send cookies (httpOnly token) to backend

API.interceptors.request.use((config) => {
  try {
    // safe access to localStorage in browser environment
    const token = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('token') : null;
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  } catch (e) {
    // ignore in non-browser environments
  }
  return config;
});

export default API;
export { API_ENABLED, BASE };

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the admin JWT (if present) to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Categories -----------------------------------------------------------
export const fetchCategories = () => api.get('/categories').then((res) => res.data);

// --- Places (public) --------------------------------------------------------
export const fetchPlaces = (params = {}) => api.get('/places', { params }).then((res) => res.data);
export const fetchPlaceById = (id) => api.get(`/places/${id}`).then((res) => res.data);
export const fetchPlacesForMap = () => api.get('/places/map').then((res) => res.data);
export const fetchReferenceConfig = () => api.get('/config').then((res) => res.data);
export const buildItinerary = (placeIds) => api.post('/places/itinerary', { placeIds }).then((res) => res.data);

// --- Admin auth --------------------------------------------------------------
export const adminLogin = (username, password) =>
  api.post('/auth/login', { username, password }).then((res) => res.data);
export const adminMe = () => api.get('/auth/me').then((res) => res.data);

// --- Admin place management ---------------------------------------------------
export const createPlace = (formData) =>
  api
    .post('/places', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

export const updatePlace = (id, formData) =>
  api
    .put(`/places/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

export const deletePlace = (id) => api.delete(`/places/${id}`).then((res) => res.data);

// Resolves a relative image path (e.g. "/uploads/x.jpg") returned by the API
// into an absolute URL pointing at the backend.
export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${backendOrigin}${path}`;
};

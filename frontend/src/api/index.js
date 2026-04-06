import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/users/', userData),
};

// User APIs
export const userAPI = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
};

// Place APIs
export const placeAPI = {
  getAllPlaces: () => api.get('/places/'),
  getPlace: (placeId) => api.get(`/places/${placeId}`),
  createPlace: (placeData) => api.post('/places/', placeData),
  updatePlace: (placeId, placeData) => api.put(`/places/${placeId}`, placeData),
};

// Review APIs
export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews/', reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Amenity APIs
export const amenityAPI = {
  getAllAmenities: () => api.get('/amenities/'),
  getAmenity: (amenityId) => api.get(`/amenities/${amenityId}`),
  createAmenity: (amenityData) => api.post('/amenities/', amenityData),
  updateAmenity: (amenityId, amenityData) => api.put(`/amenities/${amenityId}`, amenityData),
};

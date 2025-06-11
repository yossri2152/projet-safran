import axios from './axios'; // attention c'est ./axios (ton fichier axios.js)

const api = {
  // Auth endpoints
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  getProfile: () => axios.get('/auth/profile'),
  resetPassword: (data) => axios.post('/auth/reset-password', data),
  verifyEmail: (email) => axios.post('/auth/verify-email', { email }),

  // User endpoints
  getUsers: () => axios.get('/users'),
  getUser: (id) => axios.get(`/users/${id}`),
  updateUser: (id, data) => axios.put(`/users/${id}`, data),
  approveUser: (id) => axios.patch(`/users/${id}/approve`),
  rejectUser: (id) => axios.patch(`/users/${id}/reject`),
  deleteUser: (id) => axios.delete(`/users/${id}`),
  getPendingUsers: () => axios.get('/users/pending'),
  // Test endpoints
  testPublic: () => axios.get('/public'),
  testPrivate: () => axios.get('/private'),
  testAdmin: () => axios.get('/admin-only'),
};

export default api;

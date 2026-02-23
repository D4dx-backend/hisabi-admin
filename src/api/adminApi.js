import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Admin endpoints ──────────────────────────────────────────────────

export const adminApi = {
  login: (credentials) => api.post('/admin/login', credentials),

  getStats: () => api.get('/admin/stats'),

  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getGroups: (params) => api.get('/admin/groups', { params }),
  getGroupDetail: (id) => api.get(`/admin/groups/${id}`),
  deleteGroup: (id) => api.delete(`/admin/groups/${id}`),

  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),

  // ── Content Management: Duas ───────────────────────────────────────
  getDuas: (params) => api.get('/admin/duas', { params }),
  createDua: (data) => api.post('/admin/duas', data),
  updateDua: (id, data) => api.put(`/admin/duas/${id}`, data),
  deleteDua: (id) => api.delete(`/admin/duas/${id}`),

  // ── Content Management: Dhikr Types ───────────────────────────────
  getDhikrTypes: (params) => api.get('/admin/dhikr-types', { params }),
  createDhikrType: (data) => api.post('/admin/dhikr-types', data),
  updateDhikrType: (id, data) => api.put(`/admin/dhikr-types/${id}`, data),
  deleteDhikrType: (id) => api.delete(`/admin/dhikr-types/${id}`),

  // ── Content Management: Fasting Types ─────────────────────────────
  getFastingTypes: (params) => api.get('/admin/fasting-types', { params }),
  createFastingType: (data) => api.post('/admin/fasting-types', data),
  updateFastingType: (id, data) => api.put(`/admin/fasting-types/${id}`, data),
  deleteFastingType: (id) => api.delete(`/admin/fasting-types/${id}`),

  // ── Content Management: Quran Reading Portions ────────────────────
  getQuranReadingContents: (params) => api.get('/admin/quran-reading-content', { params }),
  createQuranReadingContent: (data) => api.post('/admin/quran-reading-content', data),
  updateQuranReadingContent: (id, data) => api.put(`/admin/quran-reading-content/${id}`, data),
  deleteQuranReadingContent: (id) => api.delete(`/admin/quran-reading-content/${id}`),

  // ── Content Management: Quran Memorization Portions ───────────────
  getQuranMemorizationContents: (params) => api.get('/admin/quran-memorization-content', { params }),
  createQuranMemorizationContent: (data) => api.post('/admin/quran-memorization-content', data),
  updateQuranMemorizationContent: (id, data) => api.put(`/admin/quran-memorization-content/${id}`, data),
  deleteQuranMemorizationContent: (id) => api.delete(`/admin/quran-memorization-content/${id}`),

  // ── Leaderboards ───────────────────────────────────────────────────
  getDhikrTrackingStats: () => api.get('/admin/models/dhikr-tracking'),
  getDuaMemorizationStats: () => api.get('/admin/models/dua-memorization'),
  getFastingStats: () => api.get('/admin/models/fasting'),
  getPrayerTrackingStats: () => api.get('/admin/models/prayer-tracking'),
  getQuranReadingStats: () => api.get('/admin/models/quran-reading'),
  getQuranMemorizationStats: () => api.get('/admin/models/quran-memorization'),
  getQuranProgressStats: () => api.get('/admin/models/quran-progress'),
  getStreakStats: (type) => api.get('/admin/models/streaks', { params: type ? { type } : {} }),

  // ── Tracking Records (read-only) ───────────────────────────────────
  getPrayerTrackingRecords: (params) => api.get('/admin/models/prayer-tracking/records', { params }),
  getQuranReadingRecords: (params) => api.get('/admin/models/quran-reading/records', { params }),
  getQuranMemorizationRecords: (params) => api.get('/admin/models/quran-memorization/records', { params }),
};

export default api;

import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  getUnread: () => api.get("/notifications/unread"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Doctor API
export const doctorAPI = {
  getMyProfile: () => api.get("/doctors/me/profile"),
  updateMyProfile: (data) => api.put("/doctors/me/profile", data),
  getMyAppointments: () => api.get("/appointments/doctor"),
  updateAppointmentStatus: (id, status) =>
    api.put(`/appointments/${id}/status`, { status }),
  getMyAvailability: () => api.get("/doctors/availability"),
  addAvailability: (data) => api.post("/doctors/availability", data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getRecentAppointments: (limit = 10) =>
    api.get(`/admin/appointments/recent?limit=${limit}`),
  createUser: (data) => api.post("/admin/users", data),
  sendNotification: (data) => api.post("/admin/notifications", data),
  sendBroadcast: (data) => api.post("/notifications/broadcast", data),
};

// User Management API (Admin)
export const usersAPI = {
  getAll: () => api.get("/users"),
  getByRole: (role) => api.get(`/users/role/${role}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Doctors Management API (Admin)
export const doctorsAPI = {
  getAll: () => api.get("/doctors"),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  getAvailability: (doctorId) => api.get(`/doctors/${doctorId}/availability`),
};

// Appointments Management API (Admin)
export const appointmentsAPI = {
  getAll: () => api.get("/appointments"),
  getById: (id) => api.get(`/appointments/${id}`),
  delete: (id) => api.delete(`/appointments/${id}`),
  updateStatus: (id, status) =>
    api.put(`/appointments/${id}/status`, { status }),
};

// Reports API (Admin)
export const reportsAPI = {
  getAppointments: () => api.get("/reports/appointments"),
  getDoctors: () => api.get("/reports/doctors"),
  getPatients: () => api.get("/reports/patients"),
};

export default api;

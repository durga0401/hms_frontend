import axios from "axios";

// Use relative URL for production (nginx proxy), absolute URL for local development
const API_URL = process.env.REACT_APP_API_URL || "/api";
let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add CSRF token to mutating requests
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method);
    if (isMutating && csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthEndpoint = requestUrl.includes("/auth/");
    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    const authPages = ["/login", "/register", "/forgot-password"];
    const isOnAuthPage = authPages.includes(window.location.pathname);

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshRequest &&
      !isOnAuthPage
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        if (!isOnAuthPage) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  // OTP-based registration
  sendRegistrationOtp: (userData) => api.post("/auth/register/send-otp", userData),
  verifyRegistrationOtp: (email, otp) => api.post("/auth/register/verify-otp", { email, otp }),
  resendRegistrationOtp: (email) => api.post("/auth/register/resend-otp", { email }),
  getCsrfToken: () => api.get("/auth/csrf-token"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  logout: () => api.post("/auth/logout"),
  oauthSession: () => api.get("/auth/oauth-session"),
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
  addPrescription: (id, prescription) =>
    api.put(`/appointments/${id}/prescription`, { prescription }),
  getMyAvailability: () => api.get("/doctors/availability"),
  addAvailability: (data) => api.post("/doctors/availability", data),
  deleteAvailability: (slotId) => api.delete(`/doctors/availability/${slotId}`),
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

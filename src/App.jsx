import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const PatientAppointments = lazy(() => import("./pages/PatientAppointments"));
const PatientDoctors = lazy(() => import("./pages/PatientDoctors"));
const PatientSettings = lazy(() => import("./pages/PatientSettings"));
const PatientProfile = lazy(() => import("./pages/PatientProfile"));
const PatientNotifications = lazy(() => import("./pages/PatientNotifications"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("./pages/DoctorAppointments"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const DoctorNotifications = lazy(() => import("./pages/DoctorNotifications"));
const DoctorAvailability = lazy(() => import("./pages/DoctorAvailability"));
const DoctorPatients = lazy(() => import("./pages/DoctorPatients"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminDoctors = lazy(() => import("./pages/AdminDoctors"));
const AdminAppointments = lazy(() => import("./pages/AdminAppointments"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route
              path="/doctor/notifications"
              element={<DoctorNotifications />}
            />
            <Route
              path="/doctor/availability"
              element={<DoctorAvailability />}
            />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/appointments/book"
              element={<BookAppointment />}
            />
            <Route
              path="/patient/appointments"
              element={<PatientAppointments />}
            />
            <Route path="/patient/doctors" element={<PatientDoctors />} />
            <Route path="/patient/settings" element={<PatientSettings />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route
              path="/patient/notifications"
              element={<PatientNotifications />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

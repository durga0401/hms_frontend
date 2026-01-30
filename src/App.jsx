import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientDoctors from "./pages/PatientDoctors";
import PatientSettings from "./pages/PatientSettings";
import PatientProfile from "./pages/PatientProfile";
import PatientNotifications from "./pages/PatientNotifications";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorNotifications from "./pages/DoctorNotifications";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorSettings from "./pages/DoctorSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAppointments from "./pages/AdminAppointments";
import AdminReports from "./pages/AdminReports";
import AdminNotifications from "./pages/AdminNotifications";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route
            path="/doctor/notifications"
            element={<DoctorNotifications />}
          />
          <Route path="/doctor/availability" element={<DoctorAvailability />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />
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
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

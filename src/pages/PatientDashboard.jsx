import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { authAPI } from "../services/api";
import { Badge, Button, Card, Modal } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardHeader = ({ name }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {getGreeting()}
          {name ? `, ${name.split(" ")[0]}` : ""}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your health today.
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 shadow-sm">
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

const UpcomingAppointmentsList = ({
  appointments,
  onViewDetails,
  onViewAll,
  searchTerm = "",
}) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800">
            Upcoming Appointments
            {searchTerm && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({appointments.length} results for "{searchTerm}")
              </span>
            )}
          </h3>
        </div>
        <button
          className="text-primary-600 text-sm font-semibold hover:text-primary-700 flex items-center gap-1 transition-colors"
          onClick={onViewAll}
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {appointments.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    searchTerm
                      ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  }
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {searchTerm
                ? "No appointments found"
                : "No upcoming appointments"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm
                ? "Try a different search term"
                : "Book an appointment to get started"}
            </p>
          </div>
        )}
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/20">
                {appointment.doctor_name?.[0] || "D"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Dr. {appointment.doctor_name}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.specialization || "General Practitioner"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">
                {appointment.appointment_date}
              </p>
              <p className="text-sm text-primary-600 font-medium">
                {appointment.appointment_time}
              </p>
            </div>
            <Badge status={appointment.status} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(appointment)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

const QuickActionButtons = ({
  onBook,
  onViewAppointments,
  onBrowseDoctors,
}) => {
  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Button
          fullWidth
          variant="gradient"
          onClick={onBook}
          className="justify-start gap-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Book New Appointment
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={onViewAppointments}
          className="justify-start gap-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          View All Appointments
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={onBrowseDoctors}
          className="justify-start gap-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Browse Doctors
        </Button>
      </div>
    </Card>
  );
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const normalizeDate = (dateValue) => {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0];
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) return "00:00";
    return String(timeValue).slice(0, 5);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [profileResponse, appointmentsResponse] = await Promise.all([
          authAPI.getProfile(),
          api.get("/appointments/patient"),
        ]);

        setProfile(profileResponse.data?.data?.user || user || null);
        setAppointments(appointmentsResponse.data?.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, location.state?.refresh]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const formatted = appointments
      .map((appt) => ({
        ...appt,
        appointment_date: normalizeDate(appt.appointment_date),
        appointment_time: normalizeTime(appt.appointment_time),
        sortDate: new Date(
          `${normalizeDate(appt.appointment_date)}T${normalizeTime(
            appt.appointment_time,
          )}`,
        ),
      }))
      .filter(
        (appt) =>
          appt.sortDate >= now &&
          appt.status !== "CANCELLED" &&
          appt.status !== "COMPLETED",
      )
      .sort((a, b) => a.sortDate - b.sortDate)
      .slice(0, 5);

    return formatted;
  }, [appointments]);

  const filteredUpcomingAppointments = useMemo(() => {
    if (!searchTerm) return upcomingAppointments;
    const term = searchTerm.toLowerCase();
    return upcomingAppointments.filter((appt) =>
      `${appt.doctor_name || ""} ${appt.specialization || ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [searchTerm, upcomingAppointments]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = upcomingAppointments.length;
    const unreadNotifications = 0;

    return { total, upcoming, unreadNotifications };
  }, [appointments, upcomingAppointments]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        user={profile || user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <Navbar
          title="Patient Dashboard"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onNewAppointment={() => navigate("/patient/appointments/book")}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6">
          <DashboardHeader name={profile?.name || user?.name} />

          {error && (
            <Card className="mb-6">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {loading ? (
            <Card className="text-center text-gray-500">
              Loading dashboard...
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        Total Appointments
                      </p>
                      <p className="text-4xl font-bold mt-2">{stats.total}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl shadow-primary-600/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        Upcoming
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {stats.upcoming}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-accent-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-accent-100 text-sm font-medium">
                        Notifications
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {stats.unreadNotifications}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <UpcomingAppointmentsList
                    appointments={filteredUpcomingAppointments}
                    searchTerm={searchTerm}
                    onViewDetails={(appointment) =>
                      setSelectedAppointment(appointment)
                    }
                    onViewAll={() => navigate("/patient/appointments")}
                  />
                </div>
                <div className="space-y-6">
                  <QuickActionButtons
                    onBook={() => navigate("/patient/appointments/book")}
                    onViewAppointments={() => navigate("/patient/appointments")}
                    onBrowseDoctors={() => navigate("/patient/doctors")}
                  />
                  {/* Help Card */}
                  <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-xl mb-2">Need Help?</h3>
                      <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        Our support team is available 24/7 to assist you with
                        your medical inquiries.
                      </p>
                      <Button
                        variant="secondary"
                        className="bg-white text-primary-600 hover:bg-gray-100"
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-lg">
                  {selectedAppointment.doctor_name?.charAt(0) || "D"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Dr. {selectedAppointment.doctor_name || "Unknown"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedAppointment.specialization || "General"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.appointment_date || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.appointment_time || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge status={selectedAppointment.status} />
            </div>

            {selectedAppointment.reason && (
              <div>
                <p className="text-sm text-gray-500">Reason for Visit</p>
                <p className="font-medium text-gray-900">
                  {selectedAppointment.reason}
                </p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-700">{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;

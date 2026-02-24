import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { authAPI } from "../services/api";
import { Badge, Button, Card, Modal } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardHeader = ({ name }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{name ? `, ${name}` : ""}
        </h1>
        <p className="text-gray-500 text-sm">
          Here is your health overview for today.
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4 text-primary-600"
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
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

const UpcomingAppointmentsList = ({ appointments, onViewDetails, onViewAll }) => {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Upcoming Appointments</h3>
        <button 
          className="text-primary-600 text-sm font-medium hover:text-primary-700"
          onClick={onViewAll}
        >
          View All →
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {appointments.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-500">
            No upcoming appointments found.
          </div>
        )}
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                {appointment.doctor_name?.[0] || "D"}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Dr. {appointment.doctor_name}
                </p>
                <p className="text-xs text-gray-500">
                  {appointment.specialization || "General"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{appointment.appointment_date}</p>
              <p>{appointment.appointment_time}</p>
            </div>
            <Badge status={appointment.status} />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(appointment)}
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
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Quick Actions</h3>
      <Button fullWidth onClick={onBook}>
        Book New Appointment
      </Button>
      <Button fullWidth variant="secondary" onClick={onViewAppointments}>
        View All Appointments
      </Button>
      <Button fullWidth variant="outline" onClick={onBrowseDoctors}>
        Browse Doctors
      </Button>
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
      .filter((appt) => appt.sortDate >= now && appt.status !== "CANCELLED")
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={profile || user} />
      <div className="flex-1">
        <Navbar
          title="Patient Dashboard"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onNewAppointment={() => navigate("/patient/appointments/book")}
        />
        <main className="p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.upcoming}
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-gray-500">Unread Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.unreadNotifications}
                  </p>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <UpcomingAppointmentsList
                    appointments={filteredUpcomingAppointments}
                    onViewDetails={(appointment) => setSelectedAppointment(appointment)}
                  />
                </div>
                <div className="space-y-6">
                  <QuickActionButtons
                    onBook={() => navigate("/patient/appointments/book")}
                    onViewAppointments={() => navigate("/patient/appointments")}
                    onBrowseDoctors={() => navigate("/patient/doctors")}
                  />
                  <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                    <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                    <p className="text-sm text-primary-100 mb-4">
                      Our support team is available 24/7 to assist you with your
                      medical inquiries.
                    </p>
                    <Button variant="secondary">Contact Support</Button>
                  </Card>
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

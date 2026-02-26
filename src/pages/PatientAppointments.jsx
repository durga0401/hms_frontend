import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loader,
  Modal,
} from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const normalizeDate = (dateValue) => {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0];
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) return "00:00";
    return String(timeValue).slice(0, 5);
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments/patient");
      const data = (response.data?.data || []).map((appt) => ({
        ...appt,
        appointment_date: normalizeDate(appt.appointment_date),
        appointment_time: normalizeTime(appt.appointment_time),
      }));
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (activeTab === "active") {
        return appt.status === "PENDING" || appt.status === "CONFIRMED";
      } else {
        return appt.status === "COMPLETED" || appt.status === "CANCELLED";
      }
    });
  }, [appointments, activeTab]);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      await api.put(`/appointments/${appointmentId}/cancel`);
      await loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
      setCancelTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar title="My Appointments" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Appointments
              </h1>
              <p className="text-gray-500">Track all your scheduled visits.</p>
            </div>
            <Button onClick={() => navigate("/patient/appointments/book")}>
              Book New Appointment
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "active"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </div>

          {error && (
            <Card className="mb-4">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {loading ? (
            <Card className="text-center">
              <Loader label="Loading appointments..." />
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card>
                  <EmptyState
                    title={
                      activeTab === "active"
                        ? "No active appointments"
                        : "No appointment history"
                    }
                    description={
                      activeTab === "active"
                        ? "You don't have any pending or confirmed appointments."
                        : "You don't have any completed or cancelled appointments yet."
                    }
                    action={
                      activeTab === "active" && (
                        <Button
                          onClick={() => navigate("/patient/appointments/book")}
                        >
                          Book Appointment
                        </Button>
                      )
                    }
                  />
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {/* Toggle Button */}
                          <button
                            onClick={() => toggleDetails(appointment.id)}
                            className="mt-1 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            title={
                              expandedId === appointment.id
                                ? "Hide details"
                                : "Show details"
                            }
                          >
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${expandedId === appointment.id ? "rotate-90" : ""}`}
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
                          <div>
                            <p className="text-lg font-semibold text-gray-800">
                              Dr. {appointment.doctor_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.specialization || "General"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {appointment.appointment_date} •{" "}
                              {appointment.appointment_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge status={appointment.status} />
                          {(appointment.status === "PENDING" ||
                            appointment.status === "CONFIRMED") && (
                            <Button
                              variant="secondary"
                              onClick={() => setCancelTarget(appointment)}
                            >
                              Cancel Appointment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {expandedId === appointment.id && (
                      <div className="border-t border-gray-100 bg-gray-50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Appointment ID
                            </p>
                            <p className="text-sm text-gray-800">
                              #{appointment.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Status
                            </p>
                            <p className="text-sm text-gray-800">
                              {appointment.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Doctor
                            </p>
                            <p className="text-sm text-gray-800">
                              Dr. {appointment.doctor_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Specialization
                            </p>
                            <p className="text-sm text-gray-800">
                              {appointment.specialization || "General"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Date
                            </p>
                            <p className="text-sm text-gray-800">
                              {appointment.appointment_date}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Time
                            </p>
                            <p className="text-sm text-gray-800">
                              {appointment.appointment_time}
                            </p>
                          </div>
                          {appointment.reason && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Reason for Visit
                              </p>
                              <p className="text-sm text-gray-800">
                                {appointment.reason}
                              </p>
                            </div>
                          )}
                          {appointment.prescription && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Prescription
                              </p>
                              <div className="mt-1 bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                  {appointment.prescription}
                                </p>
                              </div>
                            </div>
                          )}
                          {appointment.notes && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Notes
                              </p>
                              <p className="text-sm text-gray-800">
                                {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <Modal
        title="Cancel Appointment"
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this appointment with Dr.{" "}
            {cancelTarget?.doctor_name}?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={() => handleCancel(cancelTarget.id)}
              loading={cancellingId === cancelTarget?.id}
            >
              Yes, Cancel
            </Button>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              No, Keep It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientAppointments;

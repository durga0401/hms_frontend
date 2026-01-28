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
  const [filter, setFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const navigate = useNavigate();

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
    const now = new Date();
    return appointments.filter((appt) => {
      const date = new Date(
        `${appt.appointment_date}T${appt.appointment_time}`,
      );
      if (filter === "ALL") return true;
      if (filter === "UPCOMING")
        return date >= now && appt.status !== "CANCELLED";
      if (filter === "PAST") return date < now && appt.status !== "CANCELLED";
      if (filter === "CANCELLED") return appt.status === "CANCELLED";
      return true;
    });
  }, [appointments, filter]);

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <Navbar title="My Appointments" />
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Appointments
              </h1>
              <p className="text-gray-500">Track all your scheduled visits.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "All", value: "ALL" },
                { label: "Upcoming", value: "UPCOMING" },
                { label: "Past", value: "PAST" },
                { label: "Cancelled", value: "CANCELLED" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    filter === tab.value
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-gray-200 text-gray-600 hover:border-primary-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
                    title="No appointments found"
                    description="Book your first appointment to see it here."
                    action={
                      <Button
                        onClick={() => navigate("/patient/appointments/book")}
                      >
                        Book Appointment
                      </Button>
                    }
                  />
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                        {appointment.reason && (
                          <p className="text-sm text-gray-500 mt-1">
                            Reason: {appointment.reason}
                          </p>
                        )}
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
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
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

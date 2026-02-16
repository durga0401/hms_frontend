import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../services/api";
import { Badge, Button, Card, Loader } from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getMyAppointments();
      setAppointments(res.data?.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (d) => {
    if (!d) return "";
    return d.includes("T") ? d.split("T")[0] : d;
  };

  const today = new Date().toISOString().split("T")[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const todayAppts = appointments.filter(
    (a) => normalizeDate(a.appointment_date) === today,
  );

  const weekAppts = appointments.filter((a) => {
    const d = new Date(normalizeDate(a.appointment_date));
    return d >= startOfWeek && d <= endOfWeek;
  });

  const pendingAppts = appointments.filter((a) => a.status === "PENDING");

  const handleUpdateStatus = async (id, status) => {
    try {
      await doctorAPI.updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (err) {}
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar user={user} />
      <div className="flex-1">
        <DoctorNavbar title="Dashboard" />
        <main className="p-6">
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {appointments.length}
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-gray-500">Today's Appointments</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {todayAppts.length}
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {weekAppts.length}
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingAppts.length}
                  </p>
                </Card>
              </div>

              {/* Today's Schedule */}
              <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Today's Schedule
                </h2>
                {todayAppts.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No appointments scheduled for today.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                            {(appt.patient_name || "P")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {appt.patient_name || "Patient"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(appt.appointment_time)} •{" "}
                              {appt.reason || "Consultation"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={statusVariant[appt.status] || "default"}
                          >
                            {appt.status}
                          </Badge>
                          {appt.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(appt.id, "CONFIRMED")
                              }
                            >
                              Confirm
                            </Button>
                          )}
                          {appt.status === "CONFIRMED" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleUpdateStatus(appt.id, "COMPLETED")
                              }
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="flex gap-3">
                  <Button onClick={() => navigate("/doctor/availability")}>
                    Add Availability
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/doctor/appointments")}
                  >
                    View All Appointments
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;

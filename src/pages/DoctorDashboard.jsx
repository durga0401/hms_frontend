import { useEffect, useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter appointments based on search term
  const filteredTodayAppts = useMemo(() => {
    if (!searchTerm) return todayAppts;
    const term = searchTerm.toLowerCase();
    return todayAppts.filter((appt) =>
      `${appt.patient_name || ""} ${appt.reason || ""} ${appt.status || ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [searchTerm, todayAppts]);

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
        <DoctorNavbar
          title="Dashboard"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search patients..."
        />
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, Dr. {user?.name?.split(" ")[0] || "Doctor"}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here's your schedule overview for today.
            </p>
          </div>

          {loading ? (
            <Loader size="lg" />
          ) : (
            <div className="space-y-6">
              {/* Stats - Modern gradient cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        Total Appointments
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {appointments.length}
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
                        Today's Appointments
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {todayAppts.length}
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
                <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white shadow-xl shadow-primary-700/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        This Week
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {weekAppts.length}
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-500 to-primary-900 rounded-2xl p-6 text-white shadow-xl shadow-accent-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-accent-100 text-sm font-medium">
                        Pending
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {pendingAppts.length}
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
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
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
                    <h2 className="text-lg font-bold text-gray-800">
                      Today's Schedule
                      {searchTerm && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({filteredTodayAppts.length} results for "{searchTerm}
                          ")
                        </span>
                      )}
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    {filteredTodayAppts.length} appointments
                  </span>
                </div>
                <div className="p-6">
                  {filteredTodayAppts.length === 0 ? (
                    <div className="text-center py-8">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        {searchTerm
                          ? "No patients found matching your search"
                          : "No appointments scheduled for today"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm
                          ? "Try a different search term"
                          : "Enjoy your free time!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTodayAppts.map((appt) => (
                        <div
                          key={appt.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/30">
                              {(appt.patient_name || "P")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {appt.patient_name || "Patient"}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
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
                                variant="gradient"
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
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                </h2>
                <div className="flex gap-4">
                  <Button
                    variant="gradient"
                    onClick={() => navigate("/doctor/availability")}
                    className="gap-2"
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
                    Add Availability
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/doctor/appointments")}
                    className="gap-2"
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

import { useEffect, useState } from "react";
import { doctorAPI } from "../services/api";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loader,
  Modal,
  Select,
} from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getMyAppointments();
      setAppointments(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (d) => {
    if (!d) return "";
    return d.includes("T") ? d.split("T")[0] : d;
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(normalizeDate(d));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchDate = dateFilter
      ? normalizeDate(a.appointment_date) === dateFilter
      : true;
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchDate && matchStatus;
  });

  const openUpdateModal = (appt) => {
    setSelectedAppt(appt);
    setNewStatus(appt.status);
  };

  const closeModal = () => {
    setSelectedAppt(null);
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppt || !newStatus) return;
    try {
      setUpdating(true);
      await doctorAPI.updateAppointmentStatus(selectedAppt.id, newStatus);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppt.id ? { ...a, status: newStatus } : a,
        ),
      );
      closeModal();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar user={user} />
      <div className="flex-1">
        <DoctorNavbar title="Appointments" />
        <main className="p-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div className="w-48">
                  <Select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={STATUS_OPTIONS}
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDateFilter("");
                    setStatusFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>

            {/* Table */}
            {loading ? (
              <Loader />
            ) : filteredAppointments.length === 0 ? (
              <EmptyState
                title="No appointments found"
                description="There are no appointments matching your filters."
              />
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Patient
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Time
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Reason
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appt) => (
                        <tr
                          key={appt.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {appt.patient_name || "Patient"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(appt.appointment_date)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatTime(appt.appointment_time)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {appt.reason || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={statusVariant[appt.status] || "default"}
                            >
                              {appt.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openUpdateModal(appt)}
                            >
                              Update Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!selectedAppt}
        onClose={closeModal}
        title="Update Appointment Status"
      >
        {selectedAppt && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <Badge variant={statusVariant[selectedAppt.status] || "default"}>
                {selectedAppt.status}
              </Badge>
            </div>
            <Select
              label="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: "PENDING", label: "Pending" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                loading={updating}
                disabled={newStatus === selectedAppt.status}
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments;

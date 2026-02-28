import React, { useEffect, useState } from "react";
import { doctorAPI } from "../services/api";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loader,
  Modal,
  Select,
  Alert,
} from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

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
  const [activeTab, setActiveTab] = useState("active");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prescription state
  const [prescriptionAppt, setPrescriptionAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [prescriptionSuccess, setPrescriptionSuccess] = useState("");

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
    const matchTab =
      activeTab === "active"
        ? a.status === "PENDING" || a.status === "CONFIRMED"
        : a.status === "COMPLETED" || a.status === "CANCELLED";
    return matchDate && matchTab;
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

    // Prevent completing appointment before the scheduled date
    if (newStatus === "COMPLETED") {
      const appointmentDate = new Date(selectedAppt.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate > today) {
        alert("Cannot complete an appointment before the scheduled date");
        return;
      }
    }

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
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Prescription functions
  const openPrescriptionModal = (appt) => {
    setPrescriptionAppt(appt);
    setPrescriptionText(appt.prescription || "");
    setPrescriptionError("");
    setPrescriptionSuccess("");
  };

  const closePrescriptionModal = () => {
    setPrescriptionAppt(null);
    setPrescriptionText("");
    setPrescriptionError("");
    setPrescriptionSuccess("");
  };

  const handleSavePrescription = async () => {
    if (!prescriptionAppt || !prescriptionText.trim()) {
      setPrescriptionError("Prescription cannot be empty");
      return;
    }

    // Prevent completing appointment before the scheduled date (only for non-completed appointments)
    if (prescriptionAppt.status !== "COMPLETED") {
      const appointmentDate = new Date(prescriptionAppt.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate > today) {
        setPrescriptionError(
          "Cannot add prescription before the scheduled appointment date",
        );
        return;
      }
    }

    try {
      setSavingPrescription(true);
      setPrescriptionError("");
      const res = await doctorAPI.addPrescription(
        prescriptionAppt.id,
        prescriptionText,
      );

      // Update the appointment in local state
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === prescriptionAppt.id
            ? { ...a, prescription: prescriptionText, status: "COMPLETED" }
            : a,
        ),
      );

      setPrescriptionSuccess(
        res.data.message || "Prescription saved successfully",
      );
      setTimeout(() => {
        closePrescriptionModal();
      }, 1500);
    } catch (err) {
      setPrescriptionError(
        err.response?.data?.message || "Failed to save prescription",
      );
    } finally {
      setSavingPrescription(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <DoctorNavbar
          title="Appointments"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200">
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

            {/* Date Filter */}
            <Card>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                {dateFilter && (
                  <Button variant="secondary" onClick={() => setDateFilter("")}>
                    Clear Filter
                  </Button>
                )}
              </div>
            </Card>

            {/* Table */}
            {loading ? (
              <Loader />
            ) : filteredAppointments.length === 0 ? (
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
              />
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 w-10"></th>
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
                          Status
                        </th>
                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appt) => (
                        <React.Fragment key={appt.id}>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleDetails(appt.id)}
                                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                                title={
                                  expandedId === appt.id
                                    ? "Hide details"
                                    : "Show details"
                                }
                              >
                                <svg
                                  className={`w-4 h-4 text-gray-500 transition-transform ${expandedId === appt.id ? "rotate-90" : ""}`}
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
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-800">
                              {appt.patient_name || "Patient"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatDate(appt.appointment_date)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatTime(appt.appointment_time)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  statusVariant[appt.status] || "default"
                                }
                              >
                                {appt.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {appt.status !== "CANCELLED" && (
                                  <Button
                                    size="sm"
                                    variant={
                                      appt.prescription
                                        ? "secondary"
                                        : "primary"
                                    }
                                    onClick={() => openPrescriptionModal(appt)}
                                  >
                                    {appt.prescription ? "Edit Rx" : "Write Rx"}
                                  </Button>
                                )}
                                {appt.status !== "COMPLETED" &&
                                  appt.status !== "CANCELLED" && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => openUpdateModal(appt)}
                                    >
                                      Update Status
                                    </Button>
                                  )}
                                {appt.status === "CANCELLED" && (
                                  <span className="text-sm text-gray-400 italic">
                                    Cancelled
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedId === appt.id && (
                            <tr
                              key={`${appt.id}-details`}
                              className="bg-gray-50"
                            >
                              <td colSpan={6} className="py-4 px-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Appointment ID
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      #{appt.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Patient
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {appt.patient_name || "Patient"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Email
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {appt.patient_email || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Phone
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {appt.patient_phone || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Date
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {formatDate(appt.appointment_date)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Time
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {formatTime(appt.appointment_time)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Status
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {appt.status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Reason
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {appt.reason || "—"}
                                    </p>
                                  </div>
                                  {appt.prescription && (
                                    <div className="col-span-2 md:col-span-4">
                                      <p className="text-xs font-medium text-gray-500 uppercase">
                                        Prescription
                                      </p>
                                      <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200 mt-1">
                                        {appt.prescription}
                                      </p>
                                    </div>
                                  )}
                                  {appt.notes && (
                                    <div className="col-span-2 md:col-span-4">
                                      <p className="text-xs font-medium text-gray-500 uppercase">
                                        Notes
                                      </p>
                                      <p className="text-sm text-gray-800">
                                        {appt.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Current Status:</p>
              <Badge variant={statusVariant[selectedAppt.status] || "default"}>
                {selectedAppt.status}
              </Badge>
            </div>
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

      {/* Prescription Modal */}
      <Modal
        isOpen={!!prescriptionAppt}
        onClose={closePrescriptionModal}
        title={
          prescriptionAppt?.prescription
            ? "Edit Prescription"
            : "Write Prescription"
        }
      >
        {prescriptionAppt && (
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {prescriptionAppt.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Date
                  </p>
                  <p className="text-sm text-gray-800">
                    {formatDate(prescriptionAppt.appointment_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </p>
                  <p className="text-sm text-gray-800">
                    {prescriptionAppt.reason || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </p>
                  <Badge
                    variant={
                      statusVariant[prescriptionAppt.status] || "default"
                    }
                  >
                    {prescriptionAppt.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Prescription Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescription
              </label>
              <textarea
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder="Enter prescription details: medications, dosage, instructions..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Info message */}
            {prescriptionAppt.status !== "COMPLETED" && (
              <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                💡 Saving the prescription will automatically mark this
                appointment as <strong>Completed</strong>.
              </p>
            )}

            {/* Error/Success Messages */}
            {prescriptionError && (
              <Alert variant="error">{prescriptionError}</Alert>
            )}
            {prescriptionSuccess && (
              <Alert variant="success">{prescriptionSuccess}</Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={closePrescriptionModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSavePrescription}
                loading={savingPrescription}
                disabled={!prescriptionText.trim()}
              >
                {prescriptionAppt.prescription
                  ? "Update Prescription"
                  : "Save & Complete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments;

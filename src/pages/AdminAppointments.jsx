import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import { Card, Button, Modal, Alert, Badge } from "../components/ui";
import { appointmentsAPI, doctorsAPI } from "../services/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    doctorId: "",
    patientSearch: "",
  });

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        doctorsAPI.getAll(),
      ]);
      setAppointments(appointmentsRes.data.data || []);
      setDoctors(doctorsRes.data.data || []);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      doctorId: "",
      patientSearch: "",
    });
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    setModalLoading(true);
    setError("");

    try {
      await appointmentsAPI.delete(selectedAppointment.id);
      setSuccess("Appointment deleted successfully");
      setShowDeleteModal(false);
      setSelectedAppointment(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete appointment");
    } finally {
      setModalLoading(false);
    }
  };

  const openViewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const openDeleteModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  // Apply filters
  const filteredAppointments = appointments.filter((apt) => {
    // Date From filter
    if (filters.dateFrom && apt.appointment_date < filters.dateFrom) {
      return false;
    }
    // Date To filter
    if (filters.dateTo && apt.appointment_date > filters.dateTo) {
      return false;
    }
    // Status filter
    if (filters.status && apt.status !== filters.status) {
      return false;
    }
    // Doctor filter
    if (filters.doctorId && apt.doctor_id !== parseInt(filters.doctorId)) {
      return false;
    }
    // Patient search
    if (filters.patientSearch) {
      const search = filters.patientSearch.toLowerCase();
      if (
        !apt.patient_name?.toLowerCase().includes(search) &&
        !apt.patient_email?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      CONFIRMED: "primary",
      COMPLETED: "success",
      CANCELLED: "danger",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  // Stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminNavbar />
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Appointment Management
            </h1>
            <p className="text-gray-600">
              View and manage all appointments in the system
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-4"
            />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
              className="mb-4"
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-yellow-500">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-blue-500">
              <p className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </p>
              <p className="text-sm text-gray-500">Confirmed</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-green-500">
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </Card>
            <Card className="p-4 text-center border-l-4 border-red-500">
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor
                </label>
                <select
                  name="doctorId"
                  value={filters.doctorId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Search
                </label>
                <input
                  type="text"
                  name="patientSearch"
                  value={filters.patientSearch}
                  onChange={handleFilterChange}
                  placeholder="Search patient..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Showing {filteredAppointments.length} of {appointments.length}{" "}
              appointments
            </div>
          </Card>

          {/* Appointments Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          #{appointment.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-purple-600">
                                {appointment.patient_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">
                                {appointment.patient_name}
                              </span>
                              <p className="text-xs text-gray-500">
                                {appointment.patient_email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-gray-800">
                              Dr. {appointment.doctor_name}
                            </span>
                            <p className="text-xs text-gray-500">
                              {appointment.specialization}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(appointment.appointment_date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatTime(appointment.appointment_time)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openViewModal(appointment)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View"
                            >
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(appointment)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
                <p className="text-gray-500">No appointments found</p>
                {(filters.dateFrom ||
                  filters.dateTo ||
                  filters.status ||
                  filters.doctorId ||
                  filters.patientSearch) && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear filters to see all appointments
                  </button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* View Appointment Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-lg ${
                selectedAppointment.status === "COMPLETED"
                  ? "bg-green-50"
                  : selectedAppointment.status === "CONFIRMED"
                    ? "bg-blue-50"
                    : selectedAppointment.status === "CANCELLED"
                      ? "bg-red-50"
                      : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Appointment Status
                </span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            {/* Appointment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Date & Time
                </h4>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedAppointment.appointment_date)}
                </p>
                <p className="text-gray-600">
                  {formatTime(selectedAppointment.appointment_time)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Appointment ID
                </h4>
                <p className="font-semibold text-gray-800">
                  #{selectedAppointment.id}
                </p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Patient Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.patient_email}
                  </p>
                </div>
                {selectedAppointment.patient_phone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {selectedAppointment.patient_phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Doctor Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    Dr. {selectedAppointment.doctor_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Specialization</p>
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.doctor_email}
                  </p>
                </div>
                {selectedAppointment.consultation_fee && (
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="font-medium text-gray-800">
                      ${selectedAppointment.consultation_fee}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            {selectedAppointment.reason && (
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Reason for Visit
                </h4>
                <p className="text-gray-800">{selectedAppointment.reason}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Appointment"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Appointment
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete appointment{" "}
            <span className="font-semibold">#{selectedAppointment?.id}</span>?
            <br />
            <span className="text-xs">
              Patient: {selectedAppointment?.patient_name} | Doctor: Dr.{" "}
              {selectedAppointment?.doctor_name}
            </span>
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteAppointment}
              disabled={modalLoading}
            >
              {modalLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAppointments;

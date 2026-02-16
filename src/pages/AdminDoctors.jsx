import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import { Card, Button, Input, Modal, Alert, Badge } from "../components/ui";
import { doctorsAPI } from "../services/api";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    consultation_fee: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await doctorsAPI.getAll();
      setDoctors(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError("");

    try {
      const doctorData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        qualification: formData.qualification,
        consultation_fee: parseFloat(formData.consultation_fee) || 0,
      };

      await doctorsAPI.create(doctorData);
      setSuccess("Doctor created successfully");
      setShowAddModal(false);
      resetForm();
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create doctor");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setModalLoading(true);
    setError("");

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: parseInt(formData.experience) || 0,
        qualification: formData.qualification,
        consultation_fee: parseFloat(formData.consultation_fee) || 0,
      };

      await doctorsAPI.update(selectedDoctor.id, updateData);
      setSuccess("Doctor updated successfully");
      setShowEditModal(false);
      setSelectedDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update doctor");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    setModalLoading(true);
    setError("");

    try {
      await doctorsAPI.delete(selectedDoctor.id);
      setSuccess("Doctor deleted successfully");
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete doctor");
    } finally {
      setModalLoading(false);
    }
  };

  const openViewModal = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);

    // Fetch availability
    try {
      const response = await doctorsAPI.getAvailability(doctor.id);
      setDoctorAvailability(response.data.data || []);
    } catch (err) {
      setDoctorAvailability([]);
    }
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      password: "",
      specialization: doctor.specialization || "",
      experience: doctor.experience?.toString() || "",
      qualification: doctor.qualification || "",
      consultation_fee: doctor.consultation_fee?.toString() || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      experience: "",
      qualification: "",
      consultation_fee: "",
    });
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Medicine",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Surgery",
    "Urology",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminNavbar />
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Doctor Management
              </h1>
              <p className="text-gray-600">Manage all doctors in the system</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg
                className="w-5 h-5 mr-2"
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
              Add Doctor
            </Button>
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

          {/* Search and Stats */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-semibold text-gray-800">
                    {doctors.length}
                  </span>{" "}
                  doctors
                </div>
              </div>
            </div>
          </Card>

          {/* Doctors Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Specialization
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Experience
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Fee
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          #{doctor.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-green-600">
                                {doctor.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">
                                Dr. {doctor.name}
                              </span>
                              <p className="text-xs text-gray-500">
                                {doctor.qualification || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {doctor.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="primary">
                            {doctor.specialization || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {doctor.experience
                            ? `${doctor.experience} years`
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          ${doctor.consultation_fee || 0}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openViewModal(doctor)}
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
                              onClick={() => openEditModal(doctor)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(doctor)}
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
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500">No doctors found</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Doctor"
      >
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Min 6 characters"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              required
              placeholder="Years"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              required
              placeholder="e.g., MBBS, MD"
            />
            <Input
              label="Consultation Fee ($)"
              name="consultation_fee"
              type="number"
              value={formData.consultation_fee}
              onChange={handleInputChange}
              required
              placeholder="Fee amount"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={modalLoading}>
              {modalLoading ? "Creating..." : "Create Doctor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Doctor"
      >
        <form onSubmit={handleEditDoctor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              required
              placeholder="Years"
            />
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              required
              placeholder="e.g., MBBS, MD"
            />
          </div>
          <Input
            label="Consultation Fee ($)"
            name="consultation_fee"
            type="number"
            value={formData.consultation_fee}
            onChange={handleInputChange}
            required
            placeholder="Fee amount"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={modalLoading}>
              {modalLoading ? "Updating..." : "Update Doctor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Doctor Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Doctor Details"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-green-600">
                  {selectedDoctor.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Dr. {selectedDoctor.name}
                </h3>
                <p className="text-gray-500">{selectedDoctor.email}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-gray-800">
                  {selectedDoctor.specialization || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-800">
                  {selectedDoctor.experience
                    ? `${selectedDoctor.experience} years`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-gray-800">
                  {selectedDoctor.qualification || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="font-medium text-gray-800">
                  ${selectedDoctor.consultation_fee || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {selectedDoctor.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor ID</p>
                <p className="font-medium text-gray-800">
                  #{selectedDoctor.id}
                </p>
              </div>
            </div>

            {/* Availability Schedule */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Availability Schedule
              </h4>
              {doctorAvailability.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">
                          Date
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">
                          Start Time
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">
                          End Time
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {doctorAvailability.map((slot, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3">
                            {formatDate(slot.available_date)}
                          </td>
                          <td className="py-2 px-3">
                            {formatTime(slot.start_time)}
                          </td>
                          <td className="py-2 px-3">
                            {formatTime(slot.end_time)}
                          </td>
                          <td className="py-2 px-3">
                            <Badge
                              variant={slot.is_booked ? "warning" : "success"}
                            >
                              {slot.is_booked ? "Booked" : "Available"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
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
                  <p className="text-gray-500">No availability slots set</p>
                </div>
              )}
            </div>

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
        title="Delete Doctor"
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
            Delete Doctor
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">Dr. {selectedDoctor?.name}</span>?
            This will also remove all their appointments and availability data.
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
              onClick={handleDeleteDoctor}
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

export default AdminDoctors;

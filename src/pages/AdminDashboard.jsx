import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import { Card } from "../components/ui";
import { adminAPI } from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dashboardRes, appointmentsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getRecentAppointments(10),
      ]);
      setStats(dashboardRes.data.data);
      setRecentAppointments(appointmentsRes.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return recentAppointments;
    const term = searchTerm.toLowerCase();
    return recentAppointments.filter((appt) =>
      `${appt.patient_name || ""} ${appt.doctor_name || ""} ${appt.status || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm, recentAppointments]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  // Stats cards data
  const statsCards = stats
    ? [
        {
          title: "Total Users",
          value: stats.users?.total || 0,
          icon: (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ),
          color: "bg-blue-500",
          bgLight: "bg-blue-50",
        },
        {
          title: "Total Doctors",
          value: stats.users?.doctors || 0,
          icon: (
            <svg
              className="w-8 h-8"
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
          ),
          color: "bg-green-500",
          bgLight: "bg-green-50",
        },
        {
          title: "Total Patients",
          value: stats.users?.patients || 0,
          icon: (
            <svg
              className="w-8 h-8"
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
          ),
          color: "bg-purple-500",
          bgLight: "bg-purple-50",
        },
        {
          title: "Total Appointments",
          value: stats.appointments?.total || 0,
          icon: (
            <svg
              className="w-8 h-8"
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
          ),
          color: "bg-orange-500",
          bgLight: "bg-orange-50",
        },
      ]
    : [];

  // Donut chart data for appointments by status
  const appointmentsByStatus = stats?.appointments
    ? [
        {
          label: "Pending",
          value: stats.appointments.pending || 0,
          color: "#F59E0B",
        },
        {
          label: "Confirmed",
          value: stats.appointments.confirmed || 0,
          color: "#3B82F6",
        },
        {
          label: "Completed",
          value: stats.appointments.completed || 0,
          color: "#10B981",
        },
        {
          label: "Cancelled",
          value: stats.appointments.cancelled || 0,
          color: "#EF4444",
        },
      ]
    : [];

  const totalAppointments = appointmentsByStatus.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Calculate donut chart segments
  const calculateDonutSegments = () => {
    let cumulativePercent = 0;
    return appointmentsByStatus.map((item) => {
      const percent =
        totalAppointments > 0 ? (item.value / totalAppointments) * 100 : 0;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return {
        ...item,
        percent,
        startPercent,
        endPercent: cumulativePercent,
      };
    });
  };

  const donutSegments = calculateDonutSegments();

  // Quick actions
  const quickActions = [
    {
      label: "Manage Users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      onClick: () => navigate("/admin/users"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Manage Doctors",
      icon: (
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
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => navigate("/admin/doctors"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "View Reports",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      onClick: () => navigate("/admin/reports"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "View All Appointments",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: () => navigate("/admin/appointments"),
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:ml-64">
          <AdminNavbar searchValue={searchTerm} onSearchChange={setSearchTerm} />
          <div className="p-6 flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-rose-200 rounded-full animate-spin border-t-rose-600"></div>
              </div>
              <p className="text-gray-500 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminNavbar searchValue={searchTerm} onSearchChange={setSearchTerm} />
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Dashboard Overview
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back! Here's what's happening in your hospital today.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                <svg
                  className="w-5 h-5 text-rose-600"
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
                <span className="text-gray-700 font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Stats Cards - Modern gradient design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    {stats?.users?.total || 0}
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl shadow-primary-600/20 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium">
                    Total Doctors
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    {stats?.users?.doctors || 0}
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
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white shadow-xl shadow-primary-700/20 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium">
                    Total Patients
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    {stats?.users?.patients || 0}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl p-6 text-white shadow-xl shadow-accent-500/20 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-100 text-sm font-medium">
                    Appointments
                  </p>
                  <p className="text-4xl font-bold mt-2">
                    {stats?.appointments?.total || 0}
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
          </div>

          {/* Charts and Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Appointments by Status - Donut Chart */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Appointments by Status
              </h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* SVG Donut Chart */}
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {totalAppointments > 0 ? (
                      donutSegments.map((segment, index) => {
                        const radius = 80;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDasharray =
                          (segment.percent / 100) * circumference;
                        const strokeDashoffset = -(
                          (segment.startPercent / 100) *
                          circumference
                        );

                        return (
                          <circle
                            key={index}
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="30"
                            strokeDasharray={`${strokeDasharray} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 100 100)"
                          />
                        );
                      })
                    ) : (
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="30"
                      />
                    )}
                    {/* Center text */}
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      className="text-3xl font-bold"
                      fill="#374151"
                    >
                      {totalAppointments}
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      className="text-sm"
                      fill="#6B7280"
                    >
                      Total
                    </text>
                  </svg>
                </div>
                {/* Legend */}
                <div className="ml-8 space-y-3">
                  {appointmentsByStatus.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {item.label}
                      </span>
                      <span className="ml-2 text-sm font-semibold text-gray-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Appointments Highlight */}
              {stats?.appointments?.today !== undefined && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
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
                      <span className="text-sm font-medium text-blue-800">
                        Today's Appointments
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.appointments.today}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`w-full flex items-center justify-start px-4 py-3 text-white rounded-lg transition-colors ${action.color}`}
                  >
                    {action.icon}
                    <span className="ml-3 font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Appointments Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Appointments
                {searchTerm && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredAppointments.length} results for "{searchTerm}")
                  </span>
                )}
              </h2>
              <button
                onClick={() => navigate("/admin/appointments")}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View All →
              </button>
            </div>

            {filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Specialization
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800">
                            {appointment.patient_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          Dr. {appointment.doctor_name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {appointment.specialization}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(appointment.appointment_date)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatTime(appointment.appointment_time)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
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
              </div>
            )}
          </Card>

          {/* Additional Stats Row */}
          {stats?.users && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.users.admins || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">
                      Completed Appointments
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.appointments?.completed || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-yellow-600"
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
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">
                      Pending Appointments
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.appointments?.pending || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

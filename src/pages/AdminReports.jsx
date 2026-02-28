import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import { Card, Badge } from "../components/ui";
import { reportsAPI } from "../services/api";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Report data
  const [appointmentsReport, setAppointmentsReport] = useState(null);
  const [doctorsReport, setDoctorsReport] = useState(null);
  const [patientsReport, setPatientsReport] = useState(null);

  const tabs = [
    { id: "appointments", label: "Appointments Report" },
    { id: "doctors", label: "Doctors Report" },
    { id: "patients", label: "Patients Report" },
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "appointments" && !appointmentsReport) {
        const response = await reportsAPI.getAppointments();
        setAppointmentsReport(response.data.data);
      } else if (activeTab === "doctors" && !doctorsReport) {
        const response = await reportsAPI.getDoctors();
        setDoctorsReport(response.data.data);
      } else if (activeTab === "patients" && !patientsReport) {
        const response = await reportsAPI.getPatients();
        setPatientsReport(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate appointment stats
  const getAppointmentStats = () => {
    if (!appointmentsReport?.statusCounts)
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

    const stats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    appointmentsReport.statusCounts.forEach((item) => {
      const status = item.status?.toLowerCase();
      stats[status] = item.count;
      stats.total += item.count;
    });
    return stats;
  };

  // Calculate doctor stats
  const getDoctorStats = () => {
    if (!doctorsReport?.doctors)
      return { total: 0, avgExperience: 0, avgFee: 0, specializations: {} };

    const doctors = doctorsReport.doctors;
    const totalExp = doctors.reduce((sum, d) => sum + (d.experience || 0), 0);
    const totalFee = doctors.reduce(
      (sum, d) => sum + (d.consultation_fee || 0),
      0,
    );

    const specializations = {};
    doctors.forEach((d) => {
      const spec = d.specialization || "Other";
      specializations[spec] = (specializations[spec] || 0) + 1;
    });

    return {
      total: doctors.length,
      avgExperience: doctors.length
        ? (totalExp / doctors.length).toFixed(1)
        : 0,
      avgFee: doctors.length ? (totalFee / doctors.length).toFixed(0) : 0,
      specializations,
    };
  };

  // Calculate patient stats
  const getPatientStats = () => {
    if (!patientsReport?.patients) return { total: 0, thisMonth: 0 };

    const patients = patientsReport.patients;
    const now = new Date();
    const thisMonth = patients.filter((p) => {
      const created = new Date(p.created_at);
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      total: patients.length,
      thisMonth,
    };
  };

  const appointmentStats = getAppointmentStats();
  const doctorStats = getDoctorStats();
  const patientStats = getPatientStats();

  // SVG Pie Chart Component
  const PieChart = ({ data, colors }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No data available
        </div>
      );
    }

    let cumulativePercent = 0;
    const segments = data.map((item, index) => {
      const percent = (item.value / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;

      const radius = 80;
      const circumference = 2 * Math.PI * radius;
      const strokeDasharray = (percent / 100) * circumference;
      const strokeDashoffset = -((startPercent / 100) * circumference);

      return {
        ...item,
        percent,
        color: colors[index % colors.length],
        strokeDasharray,
        strokeDashoffset,
        radius,
        circumference,
      };
    });

    return (
      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={segment.radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="35"
              strokeDasharray={`${segment.strokeDasharray} ${segment.circumference}`}
              strokeDashoffset={segment.strokeDashoffset}
              transform="rotate(-90 100 100)"
            />
          ))}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-2xl font-bold"
            fill="#374151"
          >
            {total}
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
        <div className="ml-6 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-sm text-gray-600">{segment.label}</span>
              <span className="ml-2 text-sm font-semibold">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SVG Bar Chart Component
  const BarChart = ({ data, color = "#3B82F6" }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = Math.min(40, 280 / data.length - 10);

    return (
      <div className="overflow-x-auto">
        <svg
          width={Math.max(300, data.length * (barWidth + 10) + 40)}
          height="200"
          viewBox={`0 0 ${Math.max(300, data.length * (barWidth + 10) + 40)} 200`}
        >
          {/* Y-axis */}
          <line
            x1="30"
            y1="10"
            x2="30"
            y2="160"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
          {/* X-axis */}
          <line
            x1="30"
            y1="160"
            x2={data.length * (barWidth + 10) + 40}
            y2="160"
            stroke="#E5E7EB"
            strokeWidth="1"
          />

          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * 130 : 0;
            const x = 40 + index * (barWidth + 10);
            const y = 160 - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="4"
                />
                <text
                  x={x + barWidth / 2}
                  y="175"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#6B7280"
                >
                  {item.label.length > 8
                    ? item.label.substring(0, 8) + "..."
                    : item.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill="#374151"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render Appointments Report Tab
  const renderAppointmentsReport = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">
            {appointmentStats.total}
          </p>
          <p className="text-sm text-gray-500">Total Appointments</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-yellow-500">
          <p className="text-3xl font-bold text-yellow-600">
            {appointmentStats.pending}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-blue-500">
          <p className="text-3xl font-bold text-blue-600">
            {appointmentStats.confirmed}
          </p>
          <p className="text-sm text-gray-500">Confirmed</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-green-500">
          <p className="text-3xl font-bold text-green-600">
            {appointmentStats.completed}
          </p>
          <p className="text-sm text-gray-500">Completed</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-red-500">
          <p className="text-3xl font-bold text-red-600">
            {appointmentStats.cancelled}
          </p>
          <p className="text-sm text-gray-500">Cancelled</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Appointments by Status
          </h3>
          <PieChart
            data={[
              { label: "Pending", value: appointmentStats.pending },
              { label: "Confirmed", value: appointmentStats.confirmed },
              { label: "Completed", value: appointmentStats.completed },
              { label: "Cancelled", value: appointmentStats.cancelled },
            ]}
            colors={["#F59E0B", "#3B82F6", "#10B981", "#EF4444"]}
          />
        </Card>

        {/* Trend Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Daily Appointments (Last 7 Days)
          </h3>
          <BarChart
            data={(appointmentsReport?.dailyCounts || [])
              .slice(0, 7)
              .reverse()
              .map((item) => ({
                label: new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "short",
                }),
                value: item.count,
              }))}
            color="#6366F1"
          />
        </Card>
      </div>
    </div>
  );

  // Render Doctors Report Tab
  const renderDoctorsReport = () => {
    const specializationData = Object.entries(doctorStats.specializations).map(
      ([label, value]) => ({
        label,
        value,
      }),
    );

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">
              {doctorStats.total}
            </p>
            <p className="text-sm text-gray-500">Total Doctors</p>
          </Card>
          <Card className="p-4 text-center border-l-4 border-green-500">
            <p className="text-3xl font-bold text-green-600">
              {Object.keys(doctorStats.specializations).length}
            </p>
            <p className="text-sm text-gray-500">Specializations</p>
          </Card>
          <Card className="p-4 text-center border-l-4 border-blue-500">
            <p className="text-3xl font-bold text-blue-600">
              {doctorStats.avgExperience}
            </p>
            <p className="text-sm text-gray-500">Avg. Experience (yrs)</p>
          </Card>
          <Card className="p-4 text-center border-l-4 border-purple-500">
            <p className="text-3xl font-bold text-purple-600">
              ${doctorStats.avgFee}
            </p>
            <p className="text-sm text-gray-500">Avg. Consultation Fee</p>
          </Card>
        </div>

        {/* Chart and Table Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Specialization Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Doctors by Specialization
            </h3>
            <BarChart data={specializationData} color="#10B981" />
          </Card>

          {/* Top Doctors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Doctor Overview
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(doctorsReport?.doctors || [])
                .slice(0, 5)
                .map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-green-600">
                          {doctor.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Dr. {doctor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${doctor.consultation_fee}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor.experience} yrs exp
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Full Doctors Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">All Doctors</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Name
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(doctorsReport?.doctors || []).map((doctor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      Dr. {doctor.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {doctor.email}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary">{doctor.specialization}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {doctor.experience} years
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      ${doctor.consultation_fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // Render Patients Report Tab
  const renderPatientsReport = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-purple-500"
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
          <p className="text-3xl font-bold text-gray-800">
            {patientStats.total}
          </p>
          <p className="text-sm text-gray-500">Total Patients</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {patientStats.thisMonth}
          </p>
          <p className="text-sm text-gray-500">New This Month</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-blue-500"
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
          <p className="text-3xl font-bold text-blue-600">
            {patientStats.total > 0
              ? ((patientStats.thisMonth / patientStats.total) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-sm text-gray-500">Growth Rate</p>
        </Card>
      </div>

      {/* Patients Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">All Patients</h3>
          <span className="text-sm text-gray-500">
            {patientStats.total} patients
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(patientsReport?.patients || []).map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-purple-600">
                          {patient.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {patient.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {patient.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {patient.phone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(patient.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              View detailed reports and statistics
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {activeTab === "appointments" && renderAppointmentsReport()}
              {activeTab === "doctors" && renderDoctorsReport()}
              {activeTab === "patients" && renderPatientsReport()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

import { useEffect, useState } from "react";
import { adminAPI, notificationsAPI } from "../services/api";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Loader,
  Select,
} from "../components/ui";
import AdminNavbar from "../components/layout/AdminNavbar";
import AdminSidebar from "../components/layout/AdminSidebar";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "PATIENT", label: "All Patients" },
  { value: "DOCTOR", label: "All Doctors" },
  { value: "ALL", label: "Everyone (All Users)" },
];

const NOTIFICATION_TYPES = [
  { value: "SYSTEM", label: "System" },
  { value: "ADMIN", label: "Admin" },
];

const TABS = ["All", "Unread"];

const typeBadgeVariant = {
  APPOINTMENT: "primary",
  SYSTEM: "warning",
  ADMIN: "danger",
};

// ========== Broadcast Notification Form ==========
const BroadcastNotificationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    role: "PATIENT",
    title: "",
    message: "",
    type: "ADMIN",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.title.trim() || !formData.message.trim()) {
      setAlert({ type: "error", message: "Title and message are required" });
      return;
    }

    try {
      setLoading(true);

      // Handle "ALL" by sending to both PATIENT and DOCTOR
      if (formData.role === "ALL") {
        await adminAPI.sendBroadcast({ ...formData, role: "PATIENT" });
        await adminAPI.sendBroadcast({ ...formData, role: "DOCTOR" });
        setAlert({
          type: "success",
          message: "Broadcast sent to all patients and doctors!",
        });
      } else {
        const res = await adminAPI.sendBroadcast(formData);
        setAlert({
          type: "success",
          message: res.data?.message || "Broadcast sent successfully!",
        });
      }

      setFormData({
        role: "PATIENT",
        title: "",
        message: "",
        type: "ADMIN",
      });
      onSuccess?.();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to send broadcast",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Broadcast Notification
          </h2>
          <p className="text-sm text-gray-500">
            Send a notification to multiple users at once
          </p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Target Audience"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={ROLES}
          />
          <Select
            label="Notification Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={NOTIFICATION_TYPES}
          />
        </div>

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter notification title"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your notification message..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            {formData.role === "ALL"
              ? "This will be sent to all patients and doctors"
              : `This will be sent to all ${formData.role.toLowerCase()}s`}
          </p>
          <Button type="submit" loading={loading}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Send Broadcast
          </Button>
        </div>
      </form>
    </Card>
  );
};

// ========== Notification History Section ==========
const NotificationHistorySection = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res =
        activeTab === "Unread"
          ? await notificationsAPI.getUnread()
          : await notificationsAPI.getAll();
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              My Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <Card>
          <EmptyState
            title="No notifications"
            description={
              activeTab === "Unread"
                ? "You're all caught up!"
                : "You have no notifications yet."
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`relative ${!n.is_read ? "bg-primary-50 border-primary-200" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Unread dot */}
                {!n.is_read && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={typeBadgeVariant[n.type] || "default"}>
                      {n.type}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {formatDate(n.created_at)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!n.is_read && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(n.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== Quick Stats ==========
const QuickStats = ({ notifications }) => {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.is_read).length;
  const today = notifications.filter((n) => {
    const d = new Date(n.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const stats = [
    {
      label: "Total Notifications",
      value: total,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      label: "Unread",
      value: unread,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "yellow",
    },
    {
      label: "Today",
      value: today,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "green",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ========== Main Page ==========
const AdminNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsAPI.getAll();
        setNotifications(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [refreshKey]);

  const handleBroadcastSuccess = () => {
    // Refresh notifications after sending broadcast
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminNavbar />
        <main className="p-6">
          <div className="max-w-5xl space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Notification Management
              </h1>
              <p className="text-gray-500 mt-1">
                Send broadcasts and manage your notifications
              </p>
            </div>

            {/* Quick Stats */}
            <QuickStats notifications={notifications} />

            {/* Broadcast Form */}
            <BroadcastNotificationForm onSuccess={handleBroadcastSuccess} />

            {/* Notification History */}
            <NotificationHistorySection key={refreshKey} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNotifications;

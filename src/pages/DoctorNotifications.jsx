import { useEffect, useState } from "react";
import { notificationsAPI } from "../services/api";
import { Badge, Button, Card, EmptyState, Loader } from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const TABS = ["All", "Unread"];

const typeBadgeVariant = {
  APPOINTMENT: "primary",
  SYSTEM: "warning",
  ADMIN: "danger",
};

const DoctorNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res =
        activeTab === "Unread"
          ? await notificationsAPI.getUnread()
          : await notificationsAPI.getAll();
      setNotifications(res.data?.data || []);
    } catch (err) {
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
    } catch (err) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {}
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
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <DoctorNavbar title="Notifications" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="primary">{unreadCount} unread</Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
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

            {/* List */}
            {loading ? (
              <Loader />
            ) : notifications.length === 0 ? (
              <EmptyState
                title="No notifications"
                description={
                  activeTab === "Unread"
                    ? "You're all caught up!"
                    : "You have no notifications yet."
                }
              />
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <Card
                    key={n.id}
                    className={`relative ${!n.is_read ? "bg-primary-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Unread dot */}
                      {!n.is_read && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={typeBadgeVariant[n.type] || "default"}
                          >
                            {n.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDate(n.created_at)}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-800">{n.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {n.message}
                        </p>
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
        </main>
      </div>
    </div>
  );
};

export default DoctorNotifications;

import { useEffect, useState } from "react";
import { doctorAPI } from "../services/api";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Loader,
} from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const DoctorAvailability = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    available_date: "",
    start_time: "",
    end_time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getMyAvailability();
      setSlots(res.data?.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.available_date || !form.start_time || !form.end_time) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    try {
      setSubmitting(true);
      await doctorAPI.addAvailability(form);
      setMessage({ type: "success", text: "Availability added successfully." });
      setForm({ available_date: "", start_time: "", end_time: "" });
      fetchSlots();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add availability.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slotId) => {
    setMessage({ type: "", text: "" });
    try {
      await doctorAPI.deleteAvailability(slotId);
      setMessage({ type: "success", text: "Slot deleted successfully." });
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "Failed to delete availability slot.",
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d.includes("T") ? d.split("T")[0] : d);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
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

  const today = new Date().toISOString().split("T")[0];
  const upcomingSlots = slots.filter((s) => {
    const d = s.available_date?.includes("T")
      ? s.available_date.split("T")[0]
      : s.available_date;
    return d >= today;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar user={user} />
      <div className="flex-1">
        <DoctorNavbar title="Availability" />
        <main className="p-6">
          <div className="max-w-4xl space-y-6">
            {/* Add Availability Form */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Add Availability
              </h2>
              {message.text && (
                <Alert
                  type={message.type}
                  message={message.text}
                  onClose={() => setMessage({ type: "", text: "" })}
                />
              )}
              <form
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="available_date"
                    value={form.available_date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <Input
                  label="Start Time"
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                />
                <Input
                  label="End Time"
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                />
                <Button type="submit" loading={submitting}>
                  Add Slot
                </Button>
              </form>
            </Card>

            {/* Availability List */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Upcoming Availability
              </h2>
              {loading ? (
                <Loader />
              ) : upcomingSlots.length === 0 ? (
                <EmptyState
                  title="No availability"
                  description="You haven't added any upcoming availability slots."
                />
              ) : (
                <div className="space-y-3">
                  {upcomingSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {formatDate(slot.available_date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(slot.start_time)} –{" "}
                          {formatTime(slot.end_time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="primary">Available</Badge>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(slot.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorAvailability;

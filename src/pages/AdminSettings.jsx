import { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import { Alert, Button, Card, Input } from "../components/ui";
import AdminNavbar from "../components/layout/AdminNavbar";
import AdminSidebar from "../components/layout/AdminSidebar";
import { useAuth } from "../context/AuthContext";

const AdminSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      setLoading(true);
      await authAPI.updateProfile(profile);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      setLoading(true);
      await authAPI.changePassword(passwords);
      setMessage({ type: "success", text: "Password updated successfully." });
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminNavbar title="Settings" />
        <main className="p-6">
          <div className="max-w-3xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Admin Settings
              </h1>
              <p className="text-gray-500">Update your profile and password.</p>
            </div>

            {message.text && (
              <Alert
                type={message.type}
                message={message.text}
                onClose={() => setMessage({ type: "", text: "" })}
              />
            )}

            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile
              </h2>
              <form className="space-y-4" onSubmit={submitProfile}>
                <Input
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Admin Name"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="9876543210"
                />
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </form>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Change Password
              </h2>
              <form className="space-y-4" onSubmit={submitPassword}>
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <Button type="submit" variant="secondary" loading={loading}>
                  Update Password
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;

import { useEffect, useState } from "react";
import { authAPI, doctorAPI } from "../services/api";
import { Alert, Button, Card, Input } from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const DoctorSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await doctorAPI.getMyProfile();
      const data = res.data?.data || {};
      setProfile({
        name: data.name || "",
        phone: data.phone || "",
      });
    } catch (err) {}
  };

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
    setProfileMsg({ type: "", text: "" });
    try {
      setLoading(true);
      await doctorAPI.updateMyProfile({
        name: profile.name,
        phone: profile.phone,
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMsg({
        type: "success",
        text: "Password changed successfully.",
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <DoctorNavbar title="Settings" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="max-w-2xl space-y-6">
            {/* Profile Settings */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Settings
              </h2>
              {profileMsg.text && (
                <Alert
                  type={profileMsg.type}
                  message={profileMsg.text}
                  onClose={() => setProfileMsg({ type: "", text: "" })}
                />
              )}
              <form className="space-y-4 mt-4" onSubmit={submitProfile}>
                <Input
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Dr. John Doe"
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

            {/* Change Password */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Change Password
              </h2>
              {passwordMsg.text && (
                <Alert
                  type={passwordMsg.type}
                  message={passwordMsg.text}
                  onClose={() => setPasswordMsg({ type: "", text: "" })}
                />
              )}
              <form className="space-y-4 mt-4" onSubmit={submitPassword}>
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
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                <Button type="submit" variant="secondary" loading={loading}>
                  Change Password
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorSettings;

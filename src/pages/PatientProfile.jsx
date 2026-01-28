import { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import { Alert, Badge, Button, Card, Input } from "../components/ui";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const PatientProfile = () => {
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
    setProfileMsg({ type: "", text: "" });
    try {
      setLoading(true);
      await authAPI.updateProfile(profile);
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

  const initials = (user?.name || "P")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <Navbar title="Profile" showSearch={false} />
        <main className="p-6">
          <div className="max-w-3xl space-y-6">
            {/* Profile Header */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {user?.name || "Patient"}
                    <Badge variant="primary">{user?.role || "patient"}</Badge>
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </Card>

            {/* Profile Update Form */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Update Profile
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
                  placeholder="John Doe"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="9876543210"
                />
                <Button type="submit" loading={loading}>
                  Update Profile
                </Button>
              </form>
            </Card>

            {/* Change Password Section */}
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

export default PatientProfile;

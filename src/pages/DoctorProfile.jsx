import { useEffect, useState } from "react";
import { authAPI, doctorAPI } from "../services/api";
import { Alert, Badge, Button, Card, Input } from "../components/ui";
import DoctorNavbar from "../components/layout/DoctorNavbar";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import { useAuth } from "../context/AuthContext";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    consultation_fee: "",
  });
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
        specialization: data.specialization || "",
        experience: data.experience ?? "",
        qualification: data.qualification || "",
        consultation_fee: data.consultation_fee ?? "",
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
        specialization: profile.specialization,
        experience: profile.experience ? Number(profile.experience) : undefined,
        qualification: profile.qualification,
        consultation_fee: profile.consultation_fee
          ? Number(profile.consultation_fee)
          : undefined,
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

  const initials = (profile.name || "D")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <DoctorNavbar title="Profile" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          <div className="max-w-3xl space-y-6">
            {/* Profile Header */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {profile.name || "Doctor"}
                    <Badge variant="primary">Doctor</Badge>
                  </h2>
                  <p className="text-gray-500">
                    {profile.specialization || "Specialization"}
                  </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Dr. John Doe"
                    disabled
                    helperText="Full name cannot be edited"
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="9876543210"
                  />
                  <Input
                    label="Specialization"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleProfileChange}
                    placeholder="Cardiology"
                  />
                  <Input
                    label="Experience (years)"
                    name="experience"
                    type="number"
                    value={profile.experience}
                    onChange={handleProfileChange}
                    placeholder="10"
                  />
                  <Input
                    label="Qualification"
                    name="qualification"
                    value={profile.qualification}
                    onChange={handleProfileChange}
                    placeholder="MBBS, MD"
                  />
                  <Input
                    label="Consultation Fee"
                    name="consultation_fee"
                    type="number"
                    value={profile.consultation_fee}
                    onChange={handleProfileChange}
                    placeholder="500"
                  />
                </div>
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

export default DoctorProfile;

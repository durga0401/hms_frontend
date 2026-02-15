import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Input, Button, Alert, Card } from "../components/ui";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.data?.message || "OTP sent to your email.");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        otp,
        newPassword,
      });
      setMessage(response.data?.message || "Password updated successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 mb-6">
            {step === "request"
              ? "Enter your email to receive an OTP."
              : "Enter the OTP and your new password."}
          </p>

          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {message && (
            <Alert
              type="success"
              message={message}
              onClose={() => setMessage("")}
            />
          )}

          {step === "request" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Input
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Update Password
              </Button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 text-sm text-primary-600 hover:text-primary-700"
          >
            Back to login
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;

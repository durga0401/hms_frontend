import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Input, Select, Button, Alert, Card } from "../components/ui";

const roles = [
  { value: "PATIENT", label: "Patient" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "ADMIN", label: "Admin" },
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "PATIENT",
    specialization: "",
    experience: "",
    qualification: "",
    consultation_fee: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDoctor = formData.role === "DOCTOR";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all required fields.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    if (isDoctor) {
      if (
        !formData.specialization ||
        !formData.experience ||
        !formData.qualification ||
        !formData.consultation_fee
      ) {
        return "Please complete all doctor details.";
      }
    }
    return "";
  };

  const buildPayload = () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    };

    if (isDoctor) {
      return {
        ...payload,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        qualification: formData.qualification,
        consultation_fee: Number(formData.consultation_fee),
      };
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload();
      const response = await authAPI.register(payload);
      const message = response.data?.message || "Registration successful.";
      setSuccess(message);

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Join our secure medical network to manage appointments and records.
          </p>
        </div>

        <Card>
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          <form onSubmit={handleSubmit}>
            <Select
              label="Register As"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roles}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                required
                rightIcon={
                  showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.75-7.5a11.05 11.05 0 012.32-3.9m3.12-2.36A9.96 9.96 0 0112 5c5 0 9.27 3.11 10.75 7.5a11.01 11.01 0 01-4.29 5.32M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )
                }
                onRightIconClick={() => setShowPassword((prev) => !prev)}
                rightIconLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              />
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              rightIcon={
                showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.75-7.5a11.05 11.05 0 012.32-3.9m3.12-2.36A9.96 9.96 0 0112 5c5 0 9.27 3.11 10.75 7.5a11.01 11.01 0 01-4.29 5.32M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )
              }
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
              rightIconLabel={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            />

            {isDoctor && (
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary-700 font-semibold">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-3-3v6m7 2a2 2 0 002-2V7a2 2 0 00-2-2h-3.5l-1-2h-5l-1 2H5a2 2 0 00-2 2v8a2 2 0 002 2h14z"
                      />
                    </svg>
                    Professional Details
                  </div>
                  <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                    Doctor Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Cardiology"
                    required
                  />
                  <Input
                    label="Experience (Years)"
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                <Input
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="MBBS, MD, DM"
                  required
                />

                <Input
                  label="Consultation Fee"
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login here
              </a>
            </p>
          </div>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 Hospital Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;

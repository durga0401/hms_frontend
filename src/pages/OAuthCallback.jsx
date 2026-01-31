import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Loader } from "../components/ui";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        navigate(
          "/login?error=Google authentication failed. Please try again.",
        );
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));

          // Store token and user in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Update auth context
          loginWithOAuth(token, user);

          // Redirect based on role
          switch (user.role) {
            case "ADMIN":
              navigate("/admin/dashboard");
              break;
            case "DOCTOR":
              navigate("/doctor/dashboard");
              break;
            case "PATIENT":
            default:
              navigate("/patient/dashboard");
              break;
          }
        } catch (err) {
          console.error("OAuth callback error:", err);
          navigate("/login?error=Failed to process authentication");
        }
      } else {
        navigate("/login?error=Invalid authentication response");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, loginWithOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 text-center">
        <Loader />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </Card>
    </div>
  );
};

export default OAuthCallback;

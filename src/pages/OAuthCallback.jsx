import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Loader } from "../components/ui";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuth } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = async () => {
      const error = searchParams.get("error");

      if (error) {
        navigate(
          "/login?error=Google authentication failed. Please try again.",
        );
        return;
      }

      try {
        const user = await completeOAuth();

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
    };

    handleOAuthCallback();
  }, [searchParams, navigate, completeOAuth]);

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

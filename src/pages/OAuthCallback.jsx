import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Loader } from "../components/ui";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuthWithToken } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = async () => {
      const error = searchParams.get("error");
      const token = searchParams.get("token");

      if (error) {
        navigate(
          "/login?error=Google authentication failed. Please try again.",
        );
        return;
      }

      if (!token) {
        navigate("/login?error=Authentication token not received");
        return;
      }

      try {
        const user = await completeOAuthWithToken(token);

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
        navigate("/login?error=Failed to process authentication");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, completeOAuthWithToken]);

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

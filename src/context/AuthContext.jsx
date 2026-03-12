import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  authAPI,
  setCsrfToken,
  setAuthToken,
  getAuthToken,
} from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const csrfRes = await authAPI.getCsrfToken();
        if (csrfRes.data?.csrfToken) {
          setCsrfToken(csrfRes.data.csrfToken);
        }

        const authPages = ["/login", "/register", "/forgot-password"];
        const isOnAuthPage = authPages.includes(window.location.pathname);

        // Check if we have a stored token
        const hasToken = !!getAuthToken();

        if (!isOnAuthPage && hasToken) {
          const profileRes = await authAPI.getProfile();
          if (profileRes.data?.data?.user) {
            setUser(profileRes.data.data.user);
          }
        }
      } catch (err) {
        // Clear invalid token
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { user: userData, token } = response.data?.data || {};

    if (!userData) {
      throw new Error("Invalid login response");
    }

    // Store token in localStorage for cross-origin requests
    if (token) {
      setAuthToken(token);
    }

    setUser(userData);
    return userData;
  };

  // OAuth login - just set token and user without API call
  const completeOAuth = useCallback(async () => {
    const response = await authAPI.oauthSession();
    const { user: userData, token } = response.data?.data || {};
    if (!userData) {
      throw new Error("OAuth session incomplete");
    }
    if (token) {
      setAuthToken(token);
    }
    setUser(userData);
    return userData;
  }, []);

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setAuthToken(null); // Clear token on logout
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    completeOAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

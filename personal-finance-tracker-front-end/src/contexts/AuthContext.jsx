import { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired, getUserInfoFromToken } from "../utils/jwtUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user data from token on app start
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");

      if (token && !isTokenExpired(token)) {
        const userInfo = getUserInfoFromToken(token);

        if (userInfo) {
          setAccessToken(token);
          setUser(userInfo);
          setAccount(userInfo);
        } else {
          logout();
        }
      } else {
        logout();
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken, accountData = null) => {
    try {
      // Decode token to get user info
      const userInfo = getUserInfoFromToken(newToken);

      if (userInfo && !isTokenExpired(newToken)) {
        setAccessToken(newToken);
        setUser(userInfo);
        setAccount(accountData || userInfo);
        localStorage.setItem("accessToken", newToken);

        return userInfo;
      } else {
        console.error("AuthContext - Invalid or expired token");
        logout();
        return null;
      }
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      logout();
      return null;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setAccount(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  // Check if user is admin
  const isAdmin = () => {
    const adminStatus = user?.role === "admin" || user?.role === "ADMIN";
    return adminStatus;
  };

  // Get redirect path based on user role
  const getDefaultRedirectPath = () => {
    const isAdminUser = isAdmin();
    const path = isAdminUser ? "/admin/accounts" : "/dashboard";
    return path;
  };

  const value = {
    accessToken,
    account,
    user,
    loading,
    login,
    logout,
    isAdmin,
    getDefaultRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

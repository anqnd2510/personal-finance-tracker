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

      console.log(
        "AuthContext - Initializing with token:",
        token ? "exists" : "none"
      );

      if (token && !isTokenExpired(token)) {
        const userInfo = getUserInfoFromToken(token);
        console.log("AuthContext - Decoded user info:", userInfo);

        if (userInfo) {
          setAccessToken(token);
          setUser(userInfo);
          setAccount(userInfo);
          console.log("AuthContext - User role set to:", userInfo.role);
        } else {
          console.log("AuthContext - Invalid token, logging out");
          logout();
        }
      } else {
        console.log("AuthContext - Token expired or doesn't exist");
        logout();
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken, accountData = null) => {
    try {
      console.log(
        "AuthContext - Login attempt with token:",
        newToken ? "exists" : "none"
      );

      // Decode token to get user info
      const userInfo = getUserInfoFromToken(newToken);
      console.log("AuthContext - Login decoded user info:", userInfo);

      if (userInfo && !isTokenExpired(newToken)) {
        setAccessToken(newToken);
        setUser(userInfo);
        setAccount(accountData || userInfo);
        localStorage.setItem("accessToken", newToken);

        console.log(
          "AuthContext - Login successful, user role:",
          userInfo.role
        );
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
    console.log("AuthContext - Logging out");
    setAccessToken(null);
    setAccount(null);
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  // Check if user is admin
  const isAdmin = () => {
    const adminStatus = user?.role === "admin" || user?.role === "ADMIN";
    console.log(
      "AuthContext - isAdmin check:",
      adminStatus,
      "for role:",
      user?.role
    );
    return adminStatus;
  };

  // Get redirect path based on user role
  const getDefaultRedirectPath = () => {
    const isAdminUser = isAdmin();
    const path = isAdminUser ? "/admin/accounts" : "/dashboard";
    console.log(
      "AuthContext - Default redirect path:",
      path,
      "for admin status:",
      isAdminUser
    );
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

import { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired, getUserInfoFromToken } from "../utils/jwtUtils";
import { logout as logoutService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [account, setAccount] = useState(() => {
    try {
      const storedAccount = localStorage.getItem("account");
      return storedAccount ? JSON.parse(storedAccount) : null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearLocalAuth = () => {
    setAccessToken(null);
    setAccount(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("account");
  };

  // Initialize user data from token on app start
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");

      if (token && !isTokenExpired(token)) {
        const userInfo = getUserInfoFromToken(token);

        if (userInfo) {
          setAccessToken(token);
          setUser(userInfo);
          try {
            const storedAccount = localStorage.getItem("account");
            setAccount(storedAccount ? JSON.parse(storedAccount) : userInfo);
          } catch {
            setAccount(userInfo);
          }
        } else {
          clearLocalAuth();
        }
      } else {
        clearLocalAuth();
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
        localStorage.setItem("account", JSON.stringify(accountData || userInfo));

        return userInfo;
      } else {
        console.error("AuthContext - Invalid or expired token");
        clearLocalAuth();
        return null;
      }
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      clearLocalAuth();
      return null;
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("accessToken")) {
        await logoutService();
      }
    } catch (error) {
      console.error("AuthContext - Logout API error:", error);
    } finally {
      clearLocalAuth();
    }
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

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [account, setAccount] = useState(null);

  const login = (newToken, accountData) => {
    setAccessToken(newToken);
    setAccount(accountData);
    localStorage.setItem("accessToken", newToken); // Đồng bộ
  };

  const logout = () => {
    setAccessToken(null);
    setAccount(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

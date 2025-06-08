import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [account, setAccount] = useState(null);

  const login = (newToken, accountData) => {
    setToken(newToken);
    setAccount(accountData);
    localStorage.setItem("token", newToken);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ token, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import ls from "../utils/secureStorage";

const AuthContext = createContext();

// custom hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user on refresh
  useEffect(() => {
    const storedUser = ls.get("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // login
  const login = (userData) => {
    setUser(userData);
    ls.set("user", userData);
  };

  // logout
  const logout = () => {
    setUser(null);
    ls.remove("user");
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useEffect } from "react";
import ls from "../Utils/secureStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // ✅ Load from localStorage on refresh
    useEffect(() => {
        const storedUser = ls.get("user");
        const storedToken = ls.get("token");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    // ✅ LOGIN (same as your logic, just wrapped)
    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);

        ls.set("user", userData);
        ls.set("token", accessToken);
    };

    const updateUser = (userData) => {
        setUser(userData);
        ls.set("user", userData);
    };

    // ✅ LOGOUT
    const logout = () => {
        setUser(null);
        setToken(null);

        ls.remove("user");
        ls.remove("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

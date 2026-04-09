import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // ✅ Load from localStorage on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    // ✅ LOGIN (same as your logic, just wrapped)
    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", accessToken);
    };

    // ✅ LOGOUT
    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
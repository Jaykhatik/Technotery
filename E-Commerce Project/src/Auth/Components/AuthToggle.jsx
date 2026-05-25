import React from "react";

function AuthToggle({ isLogin, setIsLogin }) {
    return (
        <div className="toggle-buttons">
            <button
                className={isLogin ? "active" : ""}
                onClick={() => setIsLogin(true)}
            >
                Login
            </button>
            <button
                className={!isLogin ? "active" : ""}
                onClick={() => setIsLogin(false)}
            >
                Signup
            </button>
        </div>
    );
}

export default AuthToggle;
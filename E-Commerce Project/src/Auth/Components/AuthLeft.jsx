import React from "react";

function AuthLeft({ isLogin }) {
    return (
        <div className="auth-left">
            <h1>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h1>
            <p>
                {isLogin
                    ? "Login to access your account."
                    : "Sign up and start your journey with us."}
            </p>
        </div>
    );
}

export default AuthLeft;
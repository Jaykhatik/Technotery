import React from "react";

function AuthOptions({ isLogin }) {
    return (
        <div className="form-options">
            {isLogin ? (
                <>
                    <label>
                        <input type="checkbox" /> Remember Me
                    </label>
                    <span className="forgot">Forgot Password?</span>
                </>
            ) : (
                <label>
                    <input type="checkbox" /> Accept Terms
                </label>
            )}
        </div>
    );
}

export default AuthOptions;
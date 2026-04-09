import React, { useContext, useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Website/Contexts/AuthContext';
import AuthLeft from '../Website/Components/Auth/AuthLeft';
import AuthToggle from '../Website/Components/Auth/AuthToggle';
import FormInput from '../Website/Components/Auth/FormInput';
import FormSelect from '../Website/Components/Auth/FormSelect';
import AuthOptions from '../Website/Components/Auth/AuthOptions';
import { loginUser, signupUser } from '../Website/Services/LoginService';

function Login() {
    const { login } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            alert("Passwords do not match ");
            return;
        }

        signupUser(formData)
            .then(() => {
                alert("Signup Successful!! Please verify your email");

                setIsLogin(true);
                setFormData((prev) => ({
                    ...prev,
                    password: "",
                    confirm_password: ""
                }));
            })
            .catch((error) => {
                console.error(error);
                alert(error.message || "Signup Falied");
            });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        loginUser({
            email: formData.email,
            password: formData.password
        })
            .then((data) => {
                console.log(data);
                login(data.user, data.access_token);

                alert("Login sucess");
                const role=data.user.role;
                if(role==="admin"){
                    navigate("/admin/dashboard");
                }
                else if(role==="seller"){
                    navigate("/seller/dashboard");
                }
                else{
                    navigate("/");
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err.message || "Login Falied");
            })
    };

    // ✅ HANDLE BOTH LOGIN + SIGNUP
    const handleFormSubmit = (e) => {
        if (isLogin) {
            handleLogin(e);   // LOGIN
        } else {
            handleSubmit(e);  // SIGNUP
        }
    };
    return (
        <>
            <div className="auth-container">
                <div className="auth-card">

                    {/* LEFT SIDE */}
                    <AuthLeft isLogin={isLogin} />

                    {/* RIGHT SIDE */}
                    <div className="auth-right">

                        {/* TOGGLE */}
                        <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

                        <form className="form" onSubmit={handleFormSubmit}>

                            {/* SIGNUP ONLY */}
                            {!isLogin && (
                                <FormInput
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    label="Username"
                                />
                            )}
                            <FormInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                label="Email"
                            />


                            {/* SIGNUP ONLY */}
                            {!isLogin && (
                                <FormInput
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    label="Phone Number"
                                />
                            )}

                            <FormInput
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                label="Password"
                            />

                            {/* SIGNUP ONLY */}
                            {!isLogin && (
                                <>
                                    <FormInput
                                        type="password"
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        label="Confirm Password"
                                    />

                                    <FormSelect
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        label="Select Role"
                                        options={[
                                            { value: "customer", label: "Customer" },
                                            { value: "seller", label: "Seller" }
                                        ]}
                                    />

                                    <div className="form-options">
                                        <label>
                                            <input type="checkbox" /> Accept Terms
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* LOGIN ONLY */}
                            {isLogin && <AuthOptions isLogin={isLogin} />}

                            <button className="main-btn" >
                                {isLogin ? "Login" : "Sign Up"}
                            </button>

                            {/* SOCIAL LOGIN */}
                            <div className="divider">OR</div>

                            <div className="social-login">
                                <button className="google">Continue with Google</button>
                                <button className="github">Continue with GitHub</button>
                            </div>

                            <p className="switch-text">
                                {isLogin
                                    ? "Don’t have an account?"
                                    : "Already have an account?"}
                                <span onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? " Sign up" : " Login"}
                                </span>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;
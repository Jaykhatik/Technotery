import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [inputFields, setInputFields] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e, key) => {
        setInputFields({
            ...inputFields,
            [key]: e.target.value
        });
    };

    const handleLogin = async () => {
        try {
            const userLogin = await signInWithEmailAndPassword(
                auth,
                inputFields.email,
                inputFields.password
            );

            console.log("login user:", userLogin);

            alert("Login succssful ");
            navigate("/");

        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    };

    //for checking that which user is login

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.email);
            } else {
                console.log("No user");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="App">
            <div className="card">
                <h3>Login</h3>

                <div className="input-group">
                    <label>Email :</label>
                    <input
                        type="email"
                        value={inputFields.email}
                        onChange={(e) => handleChange(e, "email")}
                    />
                </div>

                <div className="input-group">
                    <label>Password :</label>
                    <input
                        type="password"
                        value={inputFields.password}
                        onChange={(e) => handleChange(e, "password")}
                    />
                </div>

                <div className="btn" onClick={handleLogin}>
                    Login
                </div>
            </div>
        </div>
    );
}

export default Login;
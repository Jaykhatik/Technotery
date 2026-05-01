import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
function Register() {
    const [inputFields, setInputFields] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e, key) => {
        setInputFields({
            ...inputFields,
            [key]: e.target.value
        })
    }

    const handleRegister = async () => {
        try {
            const userRegister = await createUserWithEmailAndPassword(auth, inputFields.email, inputFields.password)
            console.log(userRegister)
        } catch (err) {
            console.log(err)
            alert(err.message)
            // alert("something went wrong on register")
        }
    }
    return (
        <>
            <div className="App">
                <div className="card">
                    <h3>Register</h3>

                    <div className="input-group">
                        <label>Email :</label>
                        <input type="email" value={inputFields.email}
                            onChange={(e) => handleChange(e, "email")} />
                    </div>

                    <div className="input-group">
                        <label>Password :</label>
                        <input type="password" value={inputFields.password}
                            onChange={(e) => handleChange(e, "password")} />
                    </div>

                    <div className="btn" onClick={handleRegister}>
                        Register
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
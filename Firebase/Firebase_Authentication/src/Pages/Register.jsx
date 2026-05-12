import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, realTimeDb } from "../Utils/Firebase";
import { useNavigate } from "react-router-dom";
function Register() {
    const navigate=useNavigate();
  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e, key) => {
    setInputFields({
      ...inputFields,
      [key]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const userRegister = await createUserWithEmailAndPassword(
        auth,
        inputFields.email,
        inputFields.password,
      );
      const user = userRegister.user;
      
      // Save user details in Firebase Realtime Database
      await set(ref(realTimeDb, 'users/' + user.uid), {
        name: inputFields.name,
        email: inputFields.email,
        password:inputFields.password,
        uid: user.uid
      });
      
      alert("Registration successful!");
      navigate('/login')
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  return (
    <>
      <div className="App">
        <div className="card">
          <h3>Register</h3>

          <div className="input-group">
            <label>Name :</label>
            <input
              type="text"
              value={inputFields.name}
              onChange={(e) => handleChange(e, "name")}
            />
          </div>
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

          <div className="btn" onClick={handleRegister}>
            Register
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

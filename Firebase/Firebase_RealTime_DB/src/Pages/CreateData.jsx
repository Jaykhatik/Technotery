import React, { useState } from 'react'
import app, { realTimeDb } from '../Utils/Firebase';
import { useNavigate } from 'react-router-dom';
import { push, ref, set } from 'firebase/database';

function CreateData() {
    let navigate = useNavigate();
    const [inputFields, setInputFields] = useState({
        email: "",
        password: "",
        full_name: ""
    })

    const onChangeHandler = (e, key) => {
        setInputFields({
            ...inputFields,
            [key]: e.target.value
        })
    }
    const handleAddDoc = async () => {
        if (inputFields.email === "" || inputFields.password === "" || inputFields.full_name === "") {
            alert("please fill the data");
            return;
        }
        const realTimeUserRef = ref(realTimeDb, "RealTimeuser");
        const newUserRef = push(realTimeUserRef);
        try {
            const data = {
                ...inputFields,
                createdAt: Date.now()
            };
            console.log("DATA GOING TO FIREBASE:", data);
            await set(newUserRef, data);

            alert("data saved in realtie db in firebase");
        } catch (err) {
            console.log(err)
            alert("data not added at the reatime in fireabse")
        }


    }
    return (
        <div className="app">
            <div className="card">
                <div className="input-group">
                    <label htmlFor="">Email : </label>
                    <input type="email" name="email" id="email" placeholder='enter email id.' value={inputFields.email} onChange={(e) => onChangeHandler(e, 'email')} />
                </div>
                <div className="input-group">
                    <label htmlFor="">password : </label>
                    <input type="password" name="password" id="password" placeholder='enter password.' value={inputFields.password} onChange={(e) => onChangeHandler(e, "password")} />
                </div>
                <div className="input-group">
                    <label htmlFor="">Full name : </label>
                    <input type="text" name="fname" id="fname" placeholder='enter full name' value={inputFields.full_name} onChange={(e) => onChangeHandler(e, "full_name")} />
                </div>
                <div className="btn" onClick={handleAddDoc}>
                    save
                </div>
                <div className="btn" onClick={() => navigate("/getData")}>
                    GetData
                </div>
            </div>
        </div>
    )
}

export default CreateData
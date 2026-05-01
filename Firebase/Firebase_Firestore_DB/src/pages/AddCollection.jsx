import React, { useState } from 'react'

import app from '../Utils/Firebase';
import { db } from '../Utils/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AddCollection() {
    let navigate=useNavigate();
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
        const collectionUser = collection(db, "user");
        try {
            // await addDoc(collectionUser, inputFields);
            await addDoc(collectionUser, {
                ...inputFields,
                createdAt: new Date()
            })
            alert("user added successfully")
        }
        catch (err) {
            console.log(err)
            alert("something went wrong")
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
                <div className="btn" onClick={()=>navigate("/getCollection")}>
                    GetCollection
                </div>
            </div>
        </div>
    )
}

export default AddCollection
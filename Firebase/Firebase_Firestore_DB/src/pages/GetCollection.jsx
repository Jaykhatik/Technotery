import React, { useEffect, useState } from 'react'
import { db } from '../Utils/Firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';


function GetCollection() {
    let navigate=useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const userRefs = collection(db, "user");
        try {
            const querySnapshot = await getDocs(userRefs);
            // console.log(querySnapshot);
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setData(data)
        } catch (err) {
            console.log(err);
            alert("not fetch data");
        }
    }

    const updatePassword = async (id) => {
        const updateUserRef = doc(db, "user", id);
        try {
            await updateDoc(updateUserRef, {
                password: "789789"
            })
            alert("password updated");
        } catch (err) {
            console.log(err)
            alert("password cant updated");
        }
    }
    const deleteUser = async (id) => {
        const userRef = doc(db, "user", id);
        try {
            await deleteDoc(userRef);
            alert("User deleted");

            // Refresh data
            fetchData();
        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };
    return (

        <>
            <div className="app">
                <button onClick={()=>navigate("/")}>Back</button>
                <div className="table-container">

                    {/* Header */}
                    <div className="table-header">
                        <div>Name</div>
                        <div>Email</div>
                        <div>Password</div>
                        <div>Actions</div>
                    </div>

                    {/* Data Rows */}
                    {data.map((item) => (
                        <div className="table-row" key={item.id}>
                            <Link className='div' to={`/SingleCollection/${item.id}`}>{item.full_name}</Link>
                            <div>{item.email}</div>
                            <div>{item.password}</div>

                            <div className="actions">
                                <button
                                    className="btn update"
                                    onClick={() => updatePassword(item.id)}
                                >
                                    Update
                                </button>

                                <button
                                    className="btn delete"
                                    onClick={() => deleteUser(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default GetCollection
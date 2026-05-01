import { onValue, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { realTimeDb } from '../Utils/Firebase';

function GetData() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    //fetch data

    useEffect(() => {
        const userRef = ref(realTimeDb, "RealTimeuser");

        onValue(userRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const userList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key]
                }));

                setUsers(userList);
            } else {
                setUsers([]);
            }
        });
    }, []);


    //const update
    const updatePassword = async (id) => {
        const userRef = ref(realTimeDb, "RealTimeuser/" + id);
        try {
            await update(userRef, {
                password: "999999"
            })
            alert("password updated")
        } catch (err) {
            console.log(err)
            alert("password can't updated");
        }
    }
    //delete
    const deleteUser = async (id) => {
        const userRef = ref(realTimeDb, "RealTimeuser/" + id);
        try {
            await remove(userRef);
            alert("User deleted successfully");
        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };
    return (
        <div className="app">
            <button onClick={() => navigate("/")}>Back</button>
            <div className="table-container">

                {/* Header */}
                <div className="table-header">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Password</div>
                    <div>Actions</div>
                </div>

                {/* Data Rows */}
                {users.map((user) => (
                    <div className="table-row" key={user.id}>
                        <Link className='div' to={`/SingleData/${user.id}`}>{user.full_name}</Link>
                        <div>{user.email}</div>
                        <div>{user.password}</div>

                        <div className="actions">
                            <button className="btn update"
                                onClick={() => updatePassword(user.id)}>
                                Update
                            </button>

                            <button className="btn delete" onClick={() => deleteUser(user.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default GetData
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../Utils/Firebase';
import { doc, getDoc } from 'firebase/firestore';

function SingleCollection() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const userRef = doc(db, "user", id);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUser(userSnap.data());
            } else {
                alert("No such user found");
            }
        } catch (err) {
            console.log(err);
            alert("Error fetching user");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [id]);

    return (
        <div className="app">
            <div className="profile-card">

                {loading ? (
                    <p className="loading">Loading...</p>
                ) : user ? (
                    <>
                        <h2 className="title">User Details</h2>

                        <div className="info">
                            <span>Name:</span>
                            <p>{user.full_name}</p>
                        </div>

                        <div className="info">
                            <span>Email:</span>
                            <p>{user.email}</p>
                        </div>

                        <div className="info">
                            <span>Password:</span>
                            <p>{user.password}</p>
                        </div>
                    </>
                ) : (
                    <p>No data found</p>
                )}

            </div>
        </div>
    )
}

export default SingleCollection;
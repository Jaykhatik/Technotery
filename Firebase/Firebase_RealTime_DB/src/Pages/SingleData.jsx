import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { realTimeDb } from '../Utils/Firebase';

function SingleData() {
    const { id } = useParams();
    const [singleUser, setSingleUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const SingleuserRef = ref(realTimeDb, "RealTimeuser/" + id);
        try {
            const singleUserSnap = await get(SingleuserRef);
            if (singleUserSnap.exists()) {
                setSingleUser(singleUserSnap.val())
            } else {
                alert("No such user found");
            }
        } catch (err) {
            console.log(err)
            alert("something went wrong");
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
                ) : singleUser ? (
                    <>
                        <h2 className="title">User Details</h2>

                        <div className="info">
                            <span>Name:</span>
                            <p>{singleUser.full_name}</p>
                        </div>

                        <div className="info">
                            <span>Email:</span>
                            <p>{singleUser.email}</p>
                        </div>

                        <div className="info">
                            <span>Password:</span>
                            <p>{singleUser.password}</p>
                        </div>
                    </>
                ) : (
                    <p>No data found</p>
                )}

            </div>
        </div>
    )
}


export default SingleData
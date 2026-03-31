import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';

function Fetch() {

    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then((res) => setData(res.data))
            .catch((err) => console.log(err))
    }, [])
    return (
        <>
            <h1>fetch data from api in table</h1>
            <table className='table table-striped'>
                <thead>
                    <tr className='bg-dark text-white me-2'>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADDRESS</th>
                        <th>PHONE</th>
                        <th>WEBSITE</th>
                        <th>COMPANY</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((data, index) => (
                            <tr key={index}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.email}</td>
                                <td>{data.address.city}</td>
                                <td>{data.phone}</td>
                                <td>{data.website}</td>
                                <td>{data.company.name}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </>
    )
}

export default Fetch
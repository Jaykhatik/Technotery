import React, { useEffect, useState } from "react";
import "./Request.css";
import { FiCheck, FiX } from "react-icons/fi";
import { getCategoryRequests, updateCategoryRequestStatus,  } from "../../../Services/Admin/AdminServices";
import { useNavigate } from "react-router-dom";

function Requests() {

    const [requests, setRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getCategoryRequests();
            setRequests(data.requests);
        } catch (err) {
            console.log(err);
        }
    };
 const handleConfirm = async (request_uuid) => {
    try {
        const status = selectedStatus[request_uuid];

        if (!status) return;

        let action = "";

        if (status === "approved") action = "approve";
        else if (status === "rejected") action = "reject";
        else action = "pending";

        await updateCategoryRequestStatus(request_uuid, action);

        setRequests((prev) =>
            prev.map((item) =>
                item.request_uuid === request_uuid
                    ? { ...item, status }
                    : item
            )
        );

    } catch (err) {
        console.log(err);
    }
};


    return (
        <div className="requests-page">

            <h2 className="breadcrumb">
                <span onClick={() => navigate("/admin/categories")} className="link">
                    Categories
                </span>
                <span> / </span>
                <span>Requests</span>
            </h2>

            <div className="table-container">
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Seller</th>
                            <th>Category Name</th>
                            <th>Requested Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.request_uuid}>
                                {/* <td>{index + 1}</td> */}
                                <td>{req.request_uuid}</td>
                                <td>{req.seller_name}</td>
                                <td>{req.category_name}</td>
                                <td>{req.requested_at}</td>
                                <td>
                                    <span className={`status ${req.status?.toLowerCase() || "pending"}`}>
                                        {req.status || "Pending"}
                                    </span>
                                </td>

                                <td className="actions">
                                    <select
                                        value={
                                            selectedStatus[req.request_uuid] ||
                                            req.status ||
                                            "pending"
                                        }
                                        onChange={(e) =>
                                            setSelectedStatus((prev) => ({
                                                ...prev,
                                                [req.request_uuid]: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>

                                    <button
                                        onClick={() => handleConfirm(req.request_uuid)}
                                        disabled={
                                            selectedStatus[req.request_uuid] === req.status ||
                                            !selectedStatus[req.request_uuid]
                                        }
                                    >
                                        Confirm
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Requests;
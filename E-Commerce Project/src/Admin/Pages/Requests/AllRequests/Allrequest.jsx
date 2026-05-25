import React, { useEffect, useState } from "react";
import "./Allrequest.css";
import { useNavigate } from "react-router-dom";
import { getAllCategoryRequests, updateCategoryRequestStatusAll } from "../../../../Services/Admin/AdminServices";

function AllRequests() {

    const [allRequests, setAllRequests] = useState([]);
    const [allSelectedStatus, setAllSelectedStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequestsAll();
        console.log(allRequests);
    }, []);

    const fetchRequestsAll = async () => {
        try {
            const data = await getAllCategoryRequests();
            setAllRequests(data.requests);
        } catch (err) {
            console.log(err);
        }
    };
    const handleConfirmAll = async (request_uuid) => {
        try {
            const status = allSelectedStatus[request_uuid];

            if (!status) return;

            let action = "";

            if (status === "approved") action = "approve";
            else if (status === "rejected") action = "reject";
            else action = "pending";

            await updateCategoryRequestStatusAll(request_uuid, action);
            setAllRequests((prev) =>
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

            {/* <h2 className="breadcrumb">
                <span onClick={() => navigate("/admin/categories")} className="link">
                    Categories
                </span>
                <span> / </span>
                <span>Requests</span>
            </h2> */}

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
                        {allRequests.map((req) => (
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
                                            allSelectedStatus[req.request_uuid] ||
                                            req.status ||
                                            "pending"
                                        }
                                        onChange={(e) =>
                                            setAllSelectedStatus((prev) => ({
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
                                        onClick={() => handleConfirmAll(req.request_uuid)}
                                        disabled={
                                            allSelectedStatus[req.request_uuid] === req.status ||
                                            !allSelectedStatus[req.request_uuid]
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

export default AllRequests;
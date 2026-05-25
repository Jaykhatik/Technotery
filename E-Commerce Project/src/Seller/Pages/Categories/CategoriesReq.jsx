import React, { useEffect, useState } from "react";
import { getCategories } from "../../../Services/Admin/AdminServices";
import { requestCategoryAccess, getSellerRequests } from "../../../Services/Seller/SellerServices";
import './CategoriesReq.css';

function SellerCategories() {
    const [categories, setCategories] = useState([]);
    const [approvedCategories, setApprovedCategories] = useState([]);
    const [requested, setRequested] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // ✅ Get all categories
            const catRes = await getCategories();

            // ✅ Get seller-specific requests
            const reqRes = await getSellerRequests();

            console.log("Categories:", catRes.categories);
            console.log("Requests:", reqRes.requests);

            // 🔥 Create status map
            const statusMap = {};
            reqRes.requests.forEach(req => {
                statusMap[req.category_uuid] = req.status;
            });

            const approved = [];
            const remaining = [];
            const reqMap = {};

            // 🔥 Process categories
            catRes.categories.forEach(cat => {
                const status = statusMap[cat.uuid];

                if (status === "approved") {
                    approved.push(cat); // dropdown
                } else {
                    remaining.push(cat); // cards
                }

                if (status === "pending") {
                    reqMap[cat.uuid] = true; // disable button
                }
            });

            // ✅ Update state
            setCategories(remaining);
            setApprovedCategories(approved);
            setRequested(reqMap);

        } catch (err) {
            console.log("Error:", err);
        }
    };

    const handleRequest = async (category_uuid) => {
        try {
            const res = await requestCategoryAccess(category_uuid);
            console.log("API response:", res);

            // ✅ instant UI update
            setRequested(prev => ({
                ...prev,
                [category_uuid]: true
            }));

            // 🔥 refresh data (best practice)
            fetchData();

        } catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <div className="seller-categories">
            <h2 className="page-title">All Categories</h2>

            {/* ✅ APPROVED DROPDOWN */}
            <select className="category-dropdown">
                <option>Select Approved Category</option>
                {approvedCategories.length > 0 ? (
                    approvedCategories.map(cat => (
                        <option key={cat.uuid} value={cat.uuid}>
                            {cat.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No Approved Categories</option>
                )}
            </select>

            {/* ✅ CATEGORY CARDS */}
            <div className="category-grid">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div className="category-card" key={cat.uuid}>
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>

                            <button
                                className={`request-btn ${requested[cat.uuid] ? "requested" : ""}`}
                                onClick={() => handleRequest(cat.uuid)}
                                disabled={requested[cat.uuid]}
                            >
                                {requested[cat.uuid] ? "Pending" : "Request Access"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center" }}>
                        No categories available
                    </p>
                )}
            </div>
        </div>
    );
}

export default SellerCategories;
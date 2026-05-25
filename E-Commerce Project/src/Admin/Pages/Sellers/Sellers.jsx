import React, { useEffect, useState } from "react";
import "./Sellers.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import ls from "../../../Utils/secureStorage";

const Sellers = () => {
  const [seller, setSeller] = useState([]);
  useEffect(() => {
    const token = ls.get("token");

    axios.get("http://192.168.0.3:8000/api/admin/sellers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setSeller(res.data.sellers))
      .catch((err) => console.log(err));
  }, []);


  const handleToggleStatus = (uuid, currentStatus) => {
    const token = ls.get("token");

    axios.put(
      `http://192.168.0.3:8000/api/admin/seller/${uuid}/status`,
      {
        is_active: !currentStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        const updatedSellers = seller.map((s) =>
          s.uuid === uuid
        ? { ...s, is_active: !currentStatus }
        : s
      );
      console.log(updatedSellers)

        setSeller(updatedSellers);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="sellers-container">
      <h2>Sellers Management</h2>

      {seller.map((s) => (
        <div className="seller-row" key={s.uuid}>

          {/* LEFT SIDE */}
          <div className="seller-info">
            <div className="seller-top">
              <h3>{s.username}</h3>

              <span className={s.is_active ? "badge-active" : "badge-inactive"}>
                {s.is_active ? "Active" : "Inactive"}
              </span>

            </div>

            <p>{s.email}</p>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <button
            className={`action-btn ${s.is_active ? "deactivate" : "activate"}`}
            onClick={() => handleToggleStatus(s.uuid, s.is_active)}
          >
            {s.is_active ? (
              <>
                <FaTimesCircle /> Deactivate
              </>
            ) : (
              <>
                <FaCheckCircle /> Activate
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sellers;
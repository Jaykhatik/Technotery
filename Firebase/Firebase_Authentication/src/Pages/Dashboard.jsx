import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Utils/Firebase";
import { useNavigate } from "react-router-dom";
import { saveFile, getFiles, deleteFile } from "../Utils/indexedDB";

function Dashboard() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");

      // redirect to login page
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Logout failed ");
    }
  };
  //load files from indexedDB

  useEffect(() => {
    const loadFiles = async () => {
      const storedFiles = await getFiles();

      setFiles(storedFiles);
    };

    loadFiles();
  }, []);

  return (
    <div className="app">
      <div className="navbar">
        <div className="logo">My Dashboard</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="welcome-card">
          <h2>Welcome, User 👋</h2>
          <p>You are logged in successfully.</p>
        </div>

        <div className="card-grid">
          <div className="dashboard-card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>45</p>
          </div>

          <div className="dashboard-card">
            <h3>Revenue</h3>
            <p>₹25,000</p>
          </div>
        </div>

        {/* Uploaded Files */}
        <div>
          <h2>Uploaded Files</h2>

          {files.length === 0 ? (
            <p>No files uploaded</p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {files.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "10px",
                  }}
                >
                  {/* Image Preview */}
                  {item.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  )}

                  <h3>{item.name}</h3>

                  <p>{(item.size / 1024).toFixed(2)} KB</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

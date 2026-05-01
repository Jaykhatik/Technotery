import React, { useContext } from 'react'
import './Header.css'

// ✅ React Icons
import { FiSearch, FiBell } from "react-icons/fi";
import { AuthContext } from "../../../Website/Contexts/AuthContext";

function Header({ isCollapsed }) {

    const { user } = useContext(AuthContext);

    // ✅ Get initials (A, J, etc.)
    const getInitials = (name) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <nav className={`admin-topbar ${isCollapsed ? 'collapsed' : ''}`}>
            
            {/* LEFT */}
            <h4 className="topbar-title">
                {user?.role === "admin" ? "Admin Dashboard" : "Seller Dashboard"}
            </h4>

            {/* RIGHT */}
            <div className="topbar-right">

                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search..." />
                </div>

                {/* 🔔 Optional Notification */}
                {/* 
                <div className="notif">
                    <FiBell className="notif-icon" />
                    <span className="notif-badge">1</span>
                </div> 
                */}

                {/* USER */}
                <div className="user">
                    <div className="user-circle">
                        <span className="user-initials">
                            {getInitials(user?.username)}
                        </span>
                    </div>

                    <div className="user-info">
                        <p className="user-name">
                            {user?.username || "User"}
                        </p>
                        <small className="user-email">
                            {user?.email || "user@email.com"}
                        </small>
                    </div>
                </div>

            </div>
        </nav>
    )
}

export default Header;
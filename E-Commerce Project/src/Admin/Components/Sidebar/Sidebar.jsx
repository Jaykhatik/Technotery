import React, { useContext } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Contexts/AuthContext";

// ✅ React Icons
import {
  FiGrid,
  FiShoppingCart,
  FiTag,
  FiBox,
  FiHome,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("Logged out successfully");
    navigate("/login");
  };

  const menuItems = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
      { path: "/admin/orders", label: "Orders", icon: <FiShoppingCart /> },
      { path: "/admin/categories", label: "Categories", icon: <FiTag /> },
      { path: "/admin/allRequests", label: "Category Requests All", icon: <FiTag /> },
      { path: "/admin/products", label: "Products", icon: <FiBox /> },
      { path: "/admin/sellers", label: "Sellers", icon: <FiHome /> },
      { path: "/admin/settings", label: "Settings", icon: <FiSettings /> }
    ],

    seller: [
      { path: "/seller/dashboard", label: "Dashboard", icon: <FiGrid /> },
      { path: "/seller/products", label: "My Products", icon: <FiBox /> },
      { path: "/seller/categories", label: "Categories", icon: <FiTag /> },
      // { path: "/seller/orders", label: "Orders", icon: <FiShoppingCart /> }
    ]
  };

  return (
    <aside className={`sidebar-admin ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-admin-container">

        {/* HEADER */}
        <div className="sidebar-admin-header">
          <div className="logo-icon-admin">JH</div>

          {!isCollapsed && (
            <div className="brand-info-admin">
              <h5 className="brand-title-admin">JH</h5>
              <small className="brand-subtitle-admin">
                {user?.role === "admin" ? "Admin Panel" : "Seller Panel"}
              </small>
            </div>
          )}

          {/* TOGGLE */}
          <div
            className="sidebar-admin-toggle-btn"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </div>
        </div>

        <hr className="sidebar-admin-divider" />

        {/* 🔥 MENU (FIXED PART) */}
        <ul className="menu-list-admin">
          {menuItems[user?.role]?.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `menu-link-admin ${isActive ? "active" : ""}`
                }
                title={isCollapsed ? item.label : ""}
              >
                {({ isActive }) => (
                  <>
                    <span className="menu-icon-admin">{item.icon}</span>

                    {!isCollapsed && (
                      <span className="menu-label-admin">{item.label}</span>
                    )}

                    {/* Active Dot */}
                    {!isCollapsed && isActive && (
                      <span className="active-dot-admin"></span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer-admin">
        <div
          className="logout-btn-admin"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="logout-icon-admin">
            <FiLogOut />
          </span>
          {!isCollapsed && <span>Logout</span>}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
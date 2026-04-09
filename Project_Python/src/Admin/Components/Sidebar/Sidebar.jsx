import React, { useContext } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Website/Contexts/AuthContext";

function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
    { path: "/admin/categories", label: "Categories", icon: "🏷️" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/sellers", label: "Sellers", icon: "🏪" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <aside className={`sidebar-admin ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-admin-container">

        {/* HEADER */}
        <div className="sidebar-admin-header">
          <div className="logo-icon-admin"></div>

          {!isCollapsed && (
            <div className="brand-info-admin">
              <h5 className="brand-title-admin">JH</h5>
              <small className="brand-subtitle-admin">Admin Panel</small>
            </div>
          )}

          <button
            className="sidebar-admin-toggle-btn"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <hr className="sidebar-admin-divider" />

        {/* MENU */}
        <ul className="menu-list-admin">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `menu-link-admin ${isActive ? "active" : ""}`
                }
                title={isCollapsed ? item.label : ""}
              >
                <span className="menu-icon-admin">{item.icon}</span>

                {!isCollapsed && (
                  <span className="menu-label-admin">{item.label}</span>
                )}

                {!isCollapsed && (
                  <span className="active-dot-admin"></span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer-admin">
        <button
          className="logout-btn-admin"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="logout-icon-admin">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
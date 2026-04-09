import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Website/Contexts/AuthContext';
import './SellerSidebar.css';

function SellerSidebar({ isCollapsed, onToggleCollapse }) {

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // clear user + token

        alert("Logged out successfully");

        navigate("/login"); // redirect to auth page
    };
    const [activeMenu, setActiveMenu] = useState('dashboard')

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'categories', label: 'Categories', icon: '🏷️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
        { id: 'products', label: 'Products', icon: '📦' }
    ]

    return (
        <aside className='sidebar'>
            <div className="sidebar-container">
                {/* ===== HEADER ===== */}
                <div className="sidebar-header">
                    <div className="logo-icon"></div>
                    <div className="brand-info">
                        <h5 className="brand-title">JH</h5>
                        <small className="brand-subtitle">Admin Panel</small>
                    </div>
                    <button className="sidebar-toggle-btn" >
                        ←
                    </button>
                </div>

                <hr className="sidebar-divider" />

                {/* ===== MENU ===== */}
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.id} className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}>
                            <a href="#" className="menu-link" onClick={(e) => { e.preventDefault(); setActiveMenu(item.id); }} title={isCollapsed ? item.label : ''}>
                                <span className="menu-icon">{item.icon}</span>
                                {!isCollapsed && <span className="menu-label">{item.label}</span>}
                                {!isCollapsed && activeMenu === item.id && <span className="active-dot">●</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===== LOGOUT ===== */}
            <div className="sidebar-footer">
                <button className="logout-btn" title={isCollapsed ? 'Logout' : ''} onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    )
}

export default SellerSidebar
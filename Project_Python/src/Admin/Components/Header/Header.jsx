import React from 'react'
import './Header.css'

function Header({ isCollapsed }) {
    return (
        <>
            <nav className={`admin-topbar ${isCollapsed ? 'collapsed' : ''}`}>
                <h4 className="topbar-title">Dashboard</h4>

                <div className="topbar-right">
                    <div className="search-box">
                        <i className="bi bi-search">🔍</i>
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="notif">
                        <i className="bi bi-bell">🔔</i>
                        <span className="notif-badge">3</span>
                    </div>

                    <div className="user">
                        <div className="user-circle">
                            <img src="" alt="User" />
                        </div>
                        <div className="user-info">
                            <p className="user-name">Admin User</p>
                            <small className="user-email">admin@technotery.com</small>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
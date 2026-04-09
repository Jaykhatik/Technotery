import React, { useState } from 'react'
import Header from '../Components/Header/Header'
import Sidebar from '../Components/Sidebar/Sidebar'
import './AdminLayout.css'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="admin-layout">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
      <div className="admin-main">
        <Header isCollapsed={isCollapsed} />
        <main className="admin-content">
         <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

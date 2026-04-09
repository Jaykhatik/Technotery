import React, { useState } from 'react'
import './SellerLayout.css'
import { Outlet } from 'react-router-dom'
import SellerSidebar from '../Components/Sidebar/SellerSidebar'
import SellerHeader from '../Components/Header/SellerHeader'

function SellerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="seller-layout">
      <SellerSidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
      <div className="seller-main">
        <SellerHeader isCollapsed={isCollapsed} />
        <main className="seller-content">
         <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default SellerLayout;

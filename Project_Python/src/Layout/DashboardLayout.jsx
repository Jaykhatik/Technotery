import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Admin/Components/Sidebar/Sidebar";
import Header from "../Admin/Components/Header/Header";
import './DashboardLayout.css'

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      
      {/* SIDEBAR */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* MAIN */}
      <div className="main-content">
        
        {/* HEADER */}
        <Header isCollapsed={isCollapsed} />

        {/* PAGE CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;
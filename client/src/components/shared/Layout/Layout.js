import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when screen resizes to larger size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.querySelector(".sidebar-wrapper");
      const toggleBtn = document.querySelector(".sidebar-toggle");

      if (sidebarOpen && sidebar && toggleBtn &&
          !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="layout-container">
      <div className="header">
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className="content-area">
          <div className="container-fluid py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

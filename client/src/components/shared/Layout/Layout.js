import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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

  // Close sidebar when clicking outside (on content area)
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the toggle button
      const toggleBtn = document.querySelector(".sidebar-toggle");
      if (toggleBtn && toggleBtn.contains(e.target)) {
        return;
      }

      // Don't close if clicking inside the sidebar itself
      const sidebar = document.querySelector(".sidebar-wrapper");
      if (sidebar && sidebar.contains(e.target)) {
        return;
      }

      // Close sidebar when clicking on content area
      if (sidebarOpen) {
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
        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
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

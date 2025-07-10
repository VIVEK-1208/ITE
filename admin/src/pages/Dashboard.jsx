import React from "react";
import "./Dashboard.css";

const Dashboard = ({ user, handleLogout }) => {
  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-logo-box">
            <img
              src="/img/logo.webp"
              alt="ITE Logo"
              className="dashboard-logo"
            />
            <span className="dashboard-brand">ITE</span>
          </div>
        </header>

        <div className="dashboard-center-content">
          <img
            src="/img/dashboard.png"
            alt="Dashboard Illustration"
            className="dashboard-image"
          />
          <p className="dashboard-welcome-text">Welcome to Dashboard</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

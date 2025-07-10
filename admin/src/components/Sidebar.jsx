// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaPlusSquare,
  FaEnvelope,
  FaShoppingCart,
  FaBoxes,
} from "react-icons/fa";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Logout Error:", error);
        alert("Failed to logout. Please try again.");
      }
    }
  };
  return (
    <div className="sidebar">
  <h1 className="logo-text">ITE</h1>

  <div className="user-info">
    <img
      src={currentUser?.photoURL || "/img/default-profile.png"}
      alt="Admin"
      className="admin-avatar"
    />
    <div className="user-details">
      <p>{currentUser?.displayName || "User Name"}</p>
      <span className="user-role">Admin</span>
    </div>
  </div>

  <nav className="sidebar-links">
    <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
      <FaHome /> Dashboard
    </Link>
    <Link to="/dashboard/add-product" className={location.pathname === "/add-product" ? "active" : ""}>
      <FaPlusSquare /> Add Product
    </Link>
    <Link to="/dashboard/products" className={location.pathname === "/all-products" ? "active" : ""}>
      <FaBoxes /> List Products
    </Link>
    <Link to="/dashboard/orders" className={location.pathname === "/orders" ? "active" : ""}>
      <FaShoppingCart /> Orders
    </Link>
    <Link to="/dashboard/messages" className={location.pathname === "/messages" ? "active" : ""}>
      <FaEnvelope /> Messages
    </Link>
  </nav>

  <div className="sidebar-footer">
    <button onClick={handleLogout} title="Logout">
      <FaSignOutAlt /> Logout
    </button>
  </div>
</div>

  );
};

export default Sidebar;

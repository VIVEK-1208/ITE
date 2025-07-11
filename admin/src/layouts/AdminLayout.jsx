import React from "react";
import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import AddProduct from "../pages/AddProduct"
import Messages from "../pages/Messages";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
  <Sidebar />
  <main style={{ flex: 1, padding: "2rem", overflowX: "hidden" }}>
    <Routes>
      <Route path="" element={<Dashboard />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="messages" element={<Messages />} />
    </Routes>
  </main>
</div>
  );
};

export default AdminLayout;
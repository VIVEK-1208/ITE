// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import { downloadInvoice } from "../utils/DownloadInvoice";

const OrderHistory = () => {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          status: d.status || "Processing",
          items: d.cart || [],
        };
      });
      setOrders(data);
    };
    if (user && !loading) fetchOrders();
  }, [user, loading]);

  const handleReorder = (order) => {
    localStorage.setItem("cart", JSON.stringify(order.items));
    localStorage.setItem("cartChanged", Date.now());
    navigate("/cart");
  };

  const cancelOrder = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (confirm) {
      await updateDoc(doc(db, "orders", id), { status: "Cancelled" });
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
      );
      alert("Order cancelled. Your money will be refunded within 2-3 working days.");
    }
  };

  const exportAllToCSV = () => {
    const csv = [
      ["Order ID", "Status", "Total", "Date"],
      ...orders.map((o) => [
        o.orderId,
        o.status,
        o.total,
        o.timestamp?.seconds ? new Date(o.timestamp.seconds * 1000).toLocaleDateString() : "Unknown",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "order_history.csv";
    a.click();
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <p className="order-status-msg">Loading...</p>;
  if (!user)
    return (
      <div className="order-status-msg">
        <p>Please <strong>log in</strong> to view your order history.</p>
        <img src="/img/login.gif" alt="Login Required" className="status-img" />
      </div>
    );

  return (
    <div className="order-history">
      <h2>📦 Your Orders</h2>

      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="btn btn-outline-secondary btn-sm" onClick={exportAllToCSV}>
          Export CSV
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="order-status-msg">
          <p>No orders match your search or filter.</p>
          <img src="/img/no-order.gif" alt="No Orders" className="status-img2" />
        </div>
      ) : (
        filteredOrders.map((order) => {
          const deliveryDate = order.timestamp?.seconds
            ? new Date(order.timestamp.seconds * 1000 + 5 * 86400000)
            : null;

          return (
            <div key={order.id} className="order-card">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Date:</strong> {order.timestamp?.seconds
                ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                : "Unknown"}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Expected Delivery:</strong> {deliveryDate ? deliveryDate.toDateString() : "Unknown"}</p>

              <div className="order-progress">
                <div className={`step ${["Processing", "Shipped", "Delivered"].includes(order.status) ? "active" : ""}`}>📝 Processing</div>
                <div className={`step ${["Shipped", "Delivered"].includes(order.status) ? "active" : ""}`}>🚚 Shipped</div>
                <div className={`step ${order.status === "Delivered" ? "active" : ""}`}>✅ Delivered</div>
              </div>

              <div className="order-items">
                {order.items?.map((item, i) => (
                  <p key={i} className="item-line">
                    🛍️ {item.name} × {item.quantity} - ₹{item.price}
                  </p>
                ))}
              </div>

              <div className="order-actions mt-2">
                <button onClick={() => downloadInvoice(order)} className="btn btn-sm btn-dark me-2">Download Invoice</button>
                <button onClick={() => handleReorder(order)} className="btn btn-sm btn-warning me-2">Reorder</button>
                {order.status === "Processing" && (
                  <button onClick={() => cancelOrder(order.id)} className="btn btn-sm btn-outline-danger">Cancel</button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderHistory;

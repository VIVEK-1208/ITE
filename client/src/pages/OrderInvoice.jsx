// src/pages/OrderInvoice.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./OrderInvoice.css";
import { downloadInvoice } from "../utils/DownloadInvoice";

const OrderInvoice = () => {
  const { state } = useLocation();
  const { orderData } = state || {};
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  if (!orderData) return <p>No order data found.</p>;

  const {
    orderId,
    invoiceNumber,
    orderNumber,
    payment,
    deliveryInfo,
    cart,
    subtotal,
    deliveryFee,
    total,
    timestamp,
  } = orderData;

  return (
    <div className="invoice-page">
      {/* ✅ Success animation section */}
      <div className="success-animation">
        <div className="checkmark-circle">
          <span className="checkmark">✓</span>
        </div>
        <h2 className="success-text">Order Placed Successfully!</h2>
      </div>

      <h2>🧾 Order Invoice</h2>

      <div className="invoice-section">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Invoice No:</strong> {invoiceNumber}</p>
        <p><strong>Order No:</strong> {orderNumber}</p>
        <p><strong>Payment ID:</strong> {payment?.transactionId || "-"}</p>
        <p><strong>Paid At:</strong> {payment?.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</p>
        <p><strong>Date:</strong> {timestamp ? new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp).toLocaleString() : "-"}</p>
      </div>

      <h3>Delivery Info</h3>
      <div className="invoice-section">
        <p>{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
        <p>{deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.district}, {deliveryInfo.state} - {deliveryInfo.pincode}</p>
        <p>Phone: {deliveryInfo.phone}</p>
        <p>Email: {deliveryInfo.email}</p>
      </div>

      <h3>Items Ordered</h3>
      <ul className="item-list">
        {cart.map((item, i) => (
          <li key={i}>
            {item.name || "Unnamed Product"} × {item.quantity} = ₹{(item.price || 0) * item.quantity}
          </li>
        ))}
      </ul>

      <h3>Summary</h3>
      <div className="invoice-section">
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>Delivery Fee:</strong> ₹{deliveryFee}</p>
        <p><strong>Total Paid:</strong> ₹{total}</p>
      </div>

      <p className="redirect-message">
        Redirecting to Home in <strong>{countdown}</strong> seconds...
      </p>

      <button
        onClick={() =>
          downloadInvoice({ ...orderData, items: cart || [] })
        }
        className="home-btn"
      >
        Download Invoice PDF
      </button>

      <Link to="/" className="home-btn">Back to Home</Link>
    </div>
  );
};

export default OrderInvoice;

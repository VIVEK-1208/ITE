// src/pages/OrderInvoice.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./OrderInvoice.css";
import productData from "../data/products.json";
import { downloadInvoice } from "../utils/DownloadInvoice";

const OrderInvoice = () => {
  const { state } = useLocation();
  const { orderData } = state || {};
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 10000);

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
      <h2>🧾 Order Invoice</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Invoice No:</strong> {invoiceNumber}</p>
      <p><strong>Order No:</strong> {orderNumber}</p>
      <p><strong>Payment ID:</strong> {payment?.transactionId || "-"}</p>
      <p><strong>Paid At:</strong> {payment?.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</p>
      <p><strong>Date:</strong> {new Date(timestamp).toLocaleString()}</p>

      <h3>Delivery Info</h3>
      <p>{deliveryInfo.firstName} {deliveryInfo.lastName}</p>
      <p>{deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.district}, {deliveryInfo.state} - {deliveryInfo.pincode}</p>
      <p>Phone: {deliveryInfo.phone}</p>
      <p>Email: {deliveryInfo.email}</p>

      <h3>Items Ordered</h3>
      <ul>
        {cart.map((item, index) => {
          const product = productData.find((p) => String(p.id) === String(item.id));
          return (
            <li key={index}>
              {product?.name || "Unknown"} × {item.quantity} = ₹{(product?.price || 0) * item.quantity}
            </li>
          );
        })}
      </ul>

      <h3>Summary</h3>
      <p>Subtotal: ₹{subtotal}</p>
      <p>Delivery Fee: ₹{deliveryFee}</p>
      <p><strong>Total Paid: ₹{total}</strong></p>

      <p className="redirect-message">Redirecting to Home in {countdown} seconds...</p>

      <button
  onClick={() =>
    downloadInvoice({ ...orderData, items: orderData.cart || [] })
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

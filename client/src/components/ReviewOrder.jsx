import React, { useEffect, useState } from "react";
import "./ReviewOrder.css";
import { useNavigate } from "react-router-dom";
import { loadScript } from "../utils/loadRazorpay";
import { calculateDeliveryFee } from "../utils/deliveryFeeCalculator";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ReviewOrder = () => {
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [liveProducts, setLiveProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch delivery info and cart
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to continue.");
      navigate("/auth");
      return;
    }

    const info = JSON.parse(localStorage.getItem("deliveryInfo")) || {};
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setDeliveryInfo(info);
    setCartItems(cart);
    fetchLiveProducts(cart, info);
  }, []);

  // 🔄 Fetch latest stock & weight from Firestore
  const fetchLiveProducts = async (cart, info) => {
    let subtotal = 0;
    let totalWeight = 0;
    const productList = [];

    for (const item of cart) {
      const docRef = doc(db, "products", item.id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const product = snapshot.data();
        const qty = item.quantity;
        const price = product.price;
        const weight = product.weight || 0;
        subtotal += price * qty;
        totalWeight += weight * qty;
        productList.push({ ...product, id: item.id });
      }
    }

    const fee = calculateDeliveryFee(info.pincode, info.state, totalWeight);
    setLiveProducts(productList);
    setSubtotal(subtotal);
    setTotalWeight(totalWeight);
    setDeliveryFee(fee);
    setTotal(subtotal + fee);
  };

  // 🔁 Change delivery info
  const handleChangeInfo = () => {
    navigate("/delivery-info");
  };

  // ✅ Payment & reduce stock
  const handlePayment = async () => {
    const outOfStockItems = [];
    for (const item of cartItems) {
      const docRef = doc(db, "products", item.id);
      const snap = await getDoc(docRef);
      if (!snap.exists() || (snap.data().quantity < item.quantity)) {
        outOfStockItems.push(item.id);
      }
    }

    if (outOfStockItems.length > 0) {
      alert("Some items are out of stock. Please update your cart.");
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in before making a payment.");
      navigate("/auth");
      return;
    }

    const { firstName, lastName, email, phone } = deliveryInfo;
    const fullName = `${firstName} ${lastName}`;
    const amount = subtotal + deliveryFee;

    const options = {
      key: "rzp_test_fxJmo1J3iyvCgw",
      amount: amount * 100,
      currency: "INR",
      name: "ITE Store",
      description: "Order Payment",
      handler: async function (response) {
        try {
          // Reduce stock
          for (const item of cartItems) {
            const productRef = doc(db, "products", item.id);
            const snap = await getDoc(productRef);
            if (snap.exists()) {
              const data = snap.data();
              const updatedQty = (data.quantity || 0) - item.quantity;
              await updateDoc(productRef, { quantity: Math.max(0, updatedQty) });
            }
          }

          const orderId = "ORD" + Date.now();
          const invoiceNumber = "INV" + orderId.slice(-6);

          const orderData = {
            orderId,
            invoiceNumber,
            orderNumber: orderId,
            userId: user.uid,
            deliveryInfo,
            cart: cartItems,
            subtotal,
            deliveryFee,
            total,
            timestamp: new Date(),
            payment: {
              method: "Online",
              mode: "Razorpay",
              transactionId: response.razorpay_payment_id,
              paidAt: new Date().toISOString(),
            },
          };

          await addDoc(collection(db, "orders"), orderData);
          localStorage.removeItem("cart");
          navigate("/invoice", { state: { orderData } });
        } catch (err) {
          console.error("Order failed:", err);
          alert("Failed to process order. Try again.");
        }
      },
      prefill: {
        name: fullName,
        email,
        contact: phone,
      },
      theme: {
        color: "#0a58ca",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="review-order-page">
      <h2>Review Your Order</h2>
      <div className="review-order-container">
        <div className="left-column">
          <div className="card">
            <h3>Delivery Details</h3>
            <p><i className="fas fa-user"></i> <strong>Name:</strong> {deliveryInfo.firstName} {deliveryInfo.lastName}</p>
            <p><i className="fas fa-envelope"></i> <strong>Email:</strong> {deliveryInfo.email}</p>
            <p><i className="fas fa-phone"></i> <strong>Phone:</strong> {deliveryInfo.phone}</p>
            <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.district}, {deliveryInfo.state} - {deliveryInfo.pincode}</p>
            <button className="change-btn" onClick={handleChangeInfo}>Change</button>
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h3>Order Summary</h3>
            {cartItems.map((item) => {
              const product = liveProducts.find((p) => p.id === item.id);
              return (
                <div key={item.id} className="cart-item">
                  <span>{product?.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{product?.price * item.quantity}</span>
                </div>
              );
            })}
            <hr />
            <p><strong>Subtotal:</strong> ₹{subtotal}</p>
            <p><strong>Delivery Fee:</strong> ₹{deliveryFee}</p>
            <p><strong>Total:</strong> ₹{total}</p>
            <button className="proceed-btn" onClick={handlePayment}>Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;

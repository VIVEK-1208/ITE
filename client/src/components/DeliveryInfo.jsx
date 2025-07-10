import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import "./DeliveryInfo.css";

const DeliveryInfo = () => {
  const [autoAddress, setAutoAddress] = useState({ city: "", district: "", state: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    pincode: "",
    phone: ""
  });
  const [initialData, setInitialData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    const localData = JSON.parse(localStorage.getItem("deliveryInfo"));
    if (localData) {
      setFormData(localData);
      setAutoAddress({
        city: localData.city || "",
        district: localData.district || "",
        state: localData.state || ""
      });
      setInitialData(localData);
    }

    const fetchFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "deliveryInfo", "default");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFormData(data);
        setAutoAddress({
          city: data.city || "",
          district: data.district || "",
          state: data.state || ""
        });
        setInitialData(data);
      }
    };

    fetchFirestore();
  }, []);

  const handlePincodeBlur = async (e) => {
    const pin = e.target.value.trim();
    setFormData({ ...formData, pincode: pin });

    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const info = data[0].PostOffice[0];
          setAutoAddress({
            city: info.Block || info.Name,
            district: info.District,
            state: info.State,
          });
        } else {
          alert("Invalid pincode.");
          setAutoAddress({ city: "", district: "", state: "" });
        }
      } catch (err) {
        console.error("Error fetching pincode info:", err);
        alert("Unable to fetch address.");
      }
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setAutoAddress({
        city: initialData.city || "",
        district: initialData.district || "",
        state: initialData.state || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        pincode: "",
        phone: ""
      });
      setAutoAddress({ city: "", district: "", state: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = { ...formData, ...autoAddress };
    const required = ["firstName", "lastName", "email", "street", "pincode", "phone"];
    for (const field of required) {
      if (!data[field]) {
        alert(`Please fill out ${field}`);
        setSubmitting(false);
        return;
      }
    }

    if (!/^[6-9]\d{9}$/.test(data.phone)) {
      alert("Enter a valid 10-digit Indian phone number.");
      setSubmitting(false);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productData = await import("../data/products.json");

    const weight = cart.reduce((sum, item) => {
      const product = productData.default.find((p) => p.id === item.id);
      return sum + (product?.weight || 0) * item.quantity;
    }, 0);

    const getDeliveryFee = (pincode, state, weight) => {
      if (pincode === "831013") return 0;
      const baseState = "Jharkhand";
      const isSame = state.toLowerCase().includes(baseState.toLowerCase());
      return isSame ? 50 + weight * 20 : 100 + weight * 25;
    };

    const deliveryFee = getDeliveryFee(data.pincode, data.state, weight);

    const fullData = {
      ...data,
      weight,
      deliveryFee,
      timestamp: serverTimestamp(),
    };

    try {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid, "deliveryInfo", "default");
        await setDoc(ref, fullData);
      } else {
        await addDoc(collection(db, "deliveryInfo"), fullData);
      }

      localStorage.setItem("deliveryInfo", JSON.stringify(data));
      alert("Delivery info saved!");
      navigate("/review-order");
    } catch (err) {
      console.error("Firestore Error:", err);
      alert("Failed to save delivery info.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`delivery-page ${animate ? "fade-in" : ""}`}>
      <h2>Delivery Information</h2>
      <form className="delivery-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-icon-group">
            <i className="fas fa-user"></i>
            <input name="firstName" placeholder="First Name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          </div>
          <div className="input-icon-group">
            <i className="fas fa-user"></i>
            <input name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
        </div>

        <div className="input-icon-group">
          <i className="fas fa-envelope"></i>
          <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>

        <div className="input-icon-group">
          <i className="fas fa-map-marker-alt"></i>
          <input name="street" placeholder="Street Address" required value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} />
        </div>

        <div className="form-row">
          <div className="input-icon-group">
            <i className="fas fa-city"></i>
            <input name="city" placeholder="City" value={autoAddress.city} readOnly required />
          </div>
          <div className="input-icon-group">
            <i className="fas fa-location-arrow"></i>
            <input name="district" placeholder="District" value={autoAddress.district} readOnly required />
          </div>
        </div>

        <div className="form-row">
          <div className="input-icon-group">
            <i className="fas fa-location-dot"></i>
            <input name="pincode" placeholder="Pin Code" required value={formData.pincode} onBlur={handlePincodeBlur} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
          </div>
          <div className="input-icon-group">
            <i className="fas fa-flag"></i>
            <input name="state" placeholder="State" value={autoAddress.state} readOnly required />
          </div>
        </div>

        <div className="input-icon-group">
          <i className="fas fa-phone"></i>
          <input name="phone" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>

        <div className="form-buttons">
          <Link to="/cart" className="back-btn">Back to Cart</Link>
          <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
          <button type="submit" className="continue-btn" disabled={submitting}>
            {submitting ? "Processing..." : "Continue to Review Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryInfo;

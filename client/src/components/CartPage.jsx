import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const navigate = useNavigate();

  // Load cart and fetch live product data
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);

    const fetchProducts = async () => {
      const map = {};
      for (const item of localCart) {
        const ref = doc(db, "products", item.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          map[item.id] = snap.data();
        }
      }
      setProductMap(map);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const outOfStock = cart.filter((item) => {
      const live = productMap[item.id];
      return !live || item.quantity > (live.quantity || 0);
    });
    setOutOfStockItems(outOfStock);
  }, [cart, productMap]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const updateQuantity = (id, change) => {
    const live = productMap[id];
    const maxQty = live?.quantity || 0;

    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          if (newQty > maxQty) {
            showToast("No more stock available");
            return item;
          } else if (newQty < 1) {
            return null;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartChanged", Date.now());
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartChanged", Date.now());
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;

  const applyPromoCode = async () => {
    try {
      const response = await fetch(`/api/promo?code=${promoCode}`);
      const data = await response.json();
      if (data.valid) {
        setDiscount(data.discount);
        showToast(`Promo applied! ${data.discount}% off`);
      } else {
        setDiscount(0);
        showToast("Invalid promo code");
      }
    } catch (error) {
      console.error("Promo validation error:", error);
      showToast("Unable to validate promo");
    }
  };

  const goToDeliveryPage = () => {
    if (outOfStockItems.length > 0) {
      showToast("Please fix out-of-stock items first");
      return;
    }
    navigate("/delivery-info");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page full-height">
        <div className="cart-empty">
          <h2>Your cart is empty 😢</h2>
          <Link to="/shop" className="btn-shop">Go to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page full-height">
      {toastMsg && <div className="toast-message">{toastMsg}</div>}
      {outOfStockItems.length > 0 && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Some items are out of stock!</h3>
            <p>Please remove or reduce quantities before proceeding.</p>
            <button onClick={() => window.location.reload()}>Fix Now</button>
          </div>
        </div>
      )}

      <h2>Your Cart ({cart.length} items)</h2>

      <div className="cart-table">
        <div className="cart-header">
          <div>Items</div><div>Title</div><div>Price</div><div>Quantity</div><div>Total</div><div>Remove</div>
        </div>
        {cart.map((item) => {
          const live = productMap[item.id];
          const stock = live?.quantity ?? 0;
          const outOfStock = item.quantity > stock || stock === 0;

          return (
            <div className={`cart-row fade-in ${outOfStock ? "disabled" : ""}`} key={item.id}>
              <div className="cart-item">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
              </div>
              <div className="cart-name">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <div className="cart-sub">Brand: {item.brand}</div>
                {outOfStock && <div className="stock-alert">Out of Stock</div>}
              </div>
              <div className="cart-price">₹{item.price}</div>
              <div className="cart-qty">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  disabled={item.quantity >= stock}
                >+</button>
              </div>
              <div className="cart-total">₹{item.price * item.quantity}</div>
              <div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="checkout-section">
        <div className="checkout-left">
          <h3>Cart Total</h3>
          <div className="summary-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-line"><span>Delivery Fee</span><span>₹---</span></div>
          {discount > 0 && (
            <div className="summary-line"><span>Discount</span><span>-₹{discountAmount}</span></div>
          )}
          <div className="summary-line total">
            <strong>Total</strong>
            <strong>₹{subtotal - discountAmount} + Delivery</strong>
          </div>
          <button
            className="checkout-btn"
            disabled={outOfStockItems.length > 0}
            onClick={goToDeliveryPage}
          >
            {outOfStockItems.length > 0
              ? "Fix Out-of-Stock Items"
              : "Proceed to Checkout"}
          </button>
        </div>

        <div className="checkout-right">
          <h4>If you have a promo code</h4>
          <div className="promo-row">
            <input
              type="text"
              placeholder="PROMOCODE"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

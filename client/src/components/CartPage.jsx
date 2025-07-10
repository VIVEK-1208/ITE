import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import productData from "../data/products.json";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const updateQuantity = (id, change) => {
    const product = productData.find((p) => p.id === id);
    if (!product) {
      showToast("Product info unavailable");
      return;
    }
    const maxQty = product.quantity;

    let updatedCart = cart
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

  const hasOutOfStock = cart.some((item) => {
    const product = productData.find((p) => p.id === item.id);
    return !product || product.quantity < item.quantity;
  });

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
      <h2>Your Cart ({cart.length} items)</h2>

      <div className="cart-table">
        <div className="cart-header">
          <div>Items</div><div>Title</div><div>Price</div><div>Quantity</div><div>Total</div><div>Remove</div>
        </div>
        {cart.map((item) => {
          const productLive = productData.find((p) => p.id === item.id);
          const liveStock = productLive?.quantity ?? 0;
          const outOfStock = liveStock === 0 || item.quantity > liveStock;

          return (
            <div className={`cart-row fade-in ${outOfStock ? "disabled" : ""}`} key={item.id}>
              <div className="cart-item">
                <Link to={`/product/${item.id}`}><img src={item.image} alt={item.name} /></Link>
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
                <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= liveStock}>+</button>
              </div>
              <div className="cart-total">₹{item.price * item.quantity}</div>
              <div><button className="remove-btn" onClick={() => removeItem(item.id)}>×</button></div>
            </div>
          );
        })}
      </div>

      <div className="checkout-section">
        <div className="checkout-left">
          <h3>Cart Total</h3>
          <div className="summary-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-line"><span>Delivery Fee</span><span>₹---</span></div>
          {discount > 0 && <div className="summary-line"><span>Discount</span><span>-₹{discountAmount}</span></div>}
          <div className="summary-line total"><strong>Total</strong><strong>₹{subtotal - discountAmount} + Delivery Charge</strong></div>
          <button className="checkout-btn" disabled={hasOutOfStock} onClick={goToDeliveryPage}>
            {hasOutOfStock ? "Fix cart items to checkout" : "Proceed to Checkout"}
          </button>
        </div>

        <div className="checkout-right">
          <h4>If you have a promo code, Enter it here</h4>
          <div className="promo-row">
            <input type="text" placeholder="PROMOCODE" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
            <button onClick={applyPromoCode}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

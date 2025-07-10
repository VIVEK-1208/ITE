import React, { useState, useEffect } from "react";
import "./ProductDetail.css";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🔄 Realtime Firestore Sync
  useEffect(() => {
    const productRef = doc(db, "products", id);
    const unsubscribeProduct = onSnapshot(productRef, (docSnap) => {
      if (docSnap.exists()) {
        const productData = docSnap.data();
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const inCart = cart.find((item) => item.id === id);
        setQuantity(inCart?.quantity || 1);
        setAddedToCart(!!inCart);
        setProduct({ ...productData, id });
      }
    });

    const unsubscribeAll = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllProducts(list);
    });

    return () => {
      unsubscribeProduct();
      unsubscribeAll();
    };
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      showToast("Product is out of stock");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((p) => p.id === product.id);

    if (existingIndex !== -1) {
      const existingQty = cart[existingIndex].quantity;
      if (existingQty + quantity > product.quantity) {
        showToast("Only limited stock available");
        return;
      }
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartChanged", Date.now());
    setAddedToCart(true);
    showToast("Added to Cart");
  };

  const increaseQty = () => {
    if (quantity < product.quantity) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      updateCartQuantity(product.id, newQty);
    } else {
      showToast("Cannot exceed available stock");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      updateCartQuantity(product.id, newQty);
    } else {
      removeFromCart(product.id);
      setQuantity(1);
      setAddedToCart(false);
    }
  };

  const updateCartQuantity = (id, qty) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((p) => p.id === id);
    if (idx !== -1) {
      cart[idx].quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cartChanged", Date.now());
    }
  };

  const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((p) => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartChanged", Date.now());
  };

  if (!product) return <div className="loading-msg">Loading...</div>;

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.id !== id &&
        (item.brand === product.brand || item.type === product.type)
    )
    .slice(0, 4);

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>&gt;</span>{" "}
        <Link to="/shop">Shop</Link> <span>&gt;</span> <span>{product.name}</span>
      </div>

      {/* Product Main */}
      <div className="product-main">
        <div className="product-left">
          <img src={product.image} alt={product.name} className="product-img" />
          <span className="watch-gallery" onClick={() => setShowGallery(true)}>
            Watch gallery
          </span>
        </div>

        <div className="product-right">
          <div className="category-label">{product.type?.toUpperCase()}</div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-brand">{product.brand}</p>
          <p className="product-description">{product.description}</p>
          <p className={`product-stock ${product.quantity === 0 ? "out" : "in"}`}>
            {product.quantity === 0 ? "Out of Stock" : `In Stock: ${product.quantity}`}
          </p>

          <div className="product-action-row">
            <span className="product-price">₹{product.price}</span>
            {addedToCart ? (
              <div className="quantity-controls">
                <button onClick={decreaseQty}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQty}>+</button>
              </div>
            ) : (
              <button
                className="add-cart-btn"
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            )}
          </div>

          {addedToCart && (
            <div className="fixed-cart-btn">
              <Link to="/cart">
                <button className="go-cart-btn">Go to Cart</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <hr className="section-divider" />

      {/* Related Items */}
      <div className="related-section">
        <div className="related-header">
          <button className="scroll-arrow">←</button>
          <h2>Related Items</h2>
        </div>
        <div className="related-carousel">
          {relatedProducts.map((item, index) => (
            <div
              className="related-card"
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              {index === 0 && <span className="item-label">New</span>}
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <div className="related-category">{item.brand}</div>
              <div className="related-price">₹{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="gallery-overlay" onClick={() => setShowGallery(false)}>
          <img src={product.image} alt="Full View" className="full-gallery-image" />
        </div>
      )}

      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./Products.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterType, setFilterType] = useState("");

  const allowedBrands = [
    "Brislay",
    "Dewalt",
    "Eibenstock Positron",
    "KPT",
    "Polymak",
    "Others"
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    });

    return () => unsubscribe();
  }, []);

  const removeProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateStock = async (id, change) => {
    const productRef = doc(db, "products", id);
    const product = products.find((p) => p.id === id);
    const newQuantity = product.quantity + change;

    if (newQuantity >= 0) {
      await updateDoc(productRef, { quantity: newQuantity });
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  // Filter brands from allowed list (case-insensitive match)
  const uniqueBrands = allowedBrands;

  // Get unique types case-insensitively
  const typeMap = new Map();
  products.forEach(p => {
    const key = (p.type || "").toLowerCase();
    if (key && !typeMap.has(key)) {
      typeMap.set(key, p.type);
    }
  });
  const uniqueTypes = Array.from(typeMap.values());

  // Apply filters (all case-insensitive)
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const brandMatch = filterBrand === "" || product.brand?.toLowerCase() === filterBrand.toLowerCase();
    const typeMatch = filterType === "" || product.type?.toLowerCase() === filterType.toLowerCase();

    return nameMatch && brandMatch && typeMatch;
  });

  return (
    <div className="product-list-container">
      <h2>📦 All Products</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">All Brands</option>
          {uniqueBrands.map((brand, idx) => (
            <option key={idx} value={brand}>{brand}</option>
          ))}
        </select>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Categories</option>
          {uniqueTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        <button className="reset-btn" onClick={() => {
          setSearchTerm('');
          setFilterBrand('');
          setFilterType('');
        }}>
          🔄 Reset Filters
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Type:</strong> {product.type}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>

              <div className="stock-row">
                <strong>Stock:</strong>
                <div className="stock-control">
                  <button onClick={() => updateStock(product.id, -1)}>➖</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => updateStock(product.id, 1)}>➕</button>
                </div>
              </div>

              <button
                className="remove-button"
                onClick={() => removeProduct(product.id)}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

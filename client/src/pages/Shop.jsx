// Shop.jsx
import React, { useState, useEffect } from 'react';
import './Shop.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    brand: [],
    price: [],
    search: '',
  });

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetched);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleBrandChange = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand],
    }));
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      price: prev.price.includes(range)
        ? prev.price.filter((r) => r !== range)
        : [...prev.price, range],
    }));
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ brand: [], price: [], search: '' });
  };

  const applyFilters = (product) => {
    const matchBrand =
      filters.brand.length === 0 || filters.brand.includes(product.brand);
    const matchPrice =
      filters.price.length === 0 ||
      filters.price.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return product.price >= min && product.price <= max;
      });
    const matchSearch =
      product.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchBrand && matchPrice && matchSearch;
  };

  return (
    <div className="shop-wrapper">
      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3>Filter</h3>

          <div className="filter-group">
            <label>Brand</label>
            {['Brislay', 'Dewalt', 'Eibenstock Positron', 'KPT', 'Polymak'].map((brand) => (
              <div key={brand} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                {brand}
              </div>
            ))}
          </div>

          <div className="filter-group">
            <label>Price</label>
            {['0-4000', '4000-8000', '8000-12000', '12000-16000', '16000-20000'].map((range) => (
              <div key={range} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.price.includes(range)}
                  onChange={() => handlePriceChange(range)}
                />
                ₹{range.replace('-', ' - ₹')}
              </div>
            ))}
          </div>

          <button onClick={clearFilters} className="clear-button">
            Clear Filters
          </button>
        </aside>

        {/* Product Display */}
        <main className="shop-main">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={filters.search}
              onChange={handleSearch}
            />
            {filters.search && (
              <button onClick={() => setFilters({ ...filters, search: '' })}>
                ×
              </button>
            )}
          </div>

          <div className="product-grid">
            {products.filter(applyFilters).map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>Brand: {product.brand}</p>
                <p>₹{product.price}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;

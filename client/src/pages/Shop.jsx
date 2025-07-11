import React, { useState, useEffect } from 'react';
import './Shop.css';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Shop = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    price: [],
    search: '',
  });
  const navigate = useNavigate();

  const knownBrands = [
    'brislay',
    'dewalt',
    'eibenstock positron',
    'kpt',
    'polymak',
  ];

  const brandOptions = [
    'Brislay',
    'Dewalt',
    'Eibenstock Positron',
    'KPT',
    'Polymak',
    'Others',
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        const brand = data.brand || '';
        const lowerBrand = brand.toLowerCase();

        const displayBrand = knownBrands.includes(lowerBrand) ? brand : 'Others';

        return {
          id: doc.id,
          ...data,
          displayBrand,           // For filtering
          originalBrand: brand,   // For showing true brand
          searchName: (data.name || '').toLowerCase(),
        };
      });

      setProducts(fetched);
    });

    return () => unsubscribe();
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
    const name = product.name?.toLowerCase() || '';
    const brand = product.displayBrand?.toLowerCase();
    const description = product.description?.toLowerCase() || '';
    const keywords = (product.keywords || []).map((k) => k.toLowerCase());
    const search = filters.search.toLowerCase();

    const matchBrand =
      filters.brand.length === 0 ||
      filters.brand.some((selected) => selected.toLowerCase() === product.displayBrand.toLowerCase());

    const matchPrice =
      filters.price.length === 0 ||
      filters.price.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return product.price >= min && product.price <= max;
      });

    const matchSearch =
      name.includes(search) ||
      brand.includes(search) ||
      description.includes(search) ||
      keywords.some((kw) => kw.includes(search));

    return matchBrand && matchPrice && matchSearch;
  };

  return (
    <div className="shop-wrapper">
      <div className="shop-layout">
        {filtersOpen && (
          <div
            className="mobile-sidebar-overlay show"
            onClick={() => setFiltersOpen(false)}
          />
        )}
        <aside className={`sidebar ${filtersOpen ? 'show' : ''}`}>
          <h3>Filter</h3>

          <div className="filter-group">
            <label onClick={() => setBrandOpen(!brandOpen)}>
              Brand
              <span className={`arrow ${brandOpen ? 'open' : 'closed'}`}>▲</span>
            </label>
            {brandOpen &&
              brandOptions.map((brand) => (
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
            <label onClick={() => setPriceOpen(!priceOpen)}>
              Price
              <span className={`arrow ${priceOpen ? 'open' : 'closed'}`}>▲</span>
            </label>
            {priceOpen &&
              ['0-4000', '4000-8000', '8000-12000', '12000-16000', '16000-20000'].map((range) => (
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

        <main className="shop-main">
          <div className="top-bar">
            <button
              className="filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Filters {filtersOpen ? '▲' : '▼'}
            </button>

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
          </div>

          <div className="product-grid">
  {products.filter(applyFilters).length === 0 ? (
    <div className="no-products">
      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="No products" />
      <h3>No products found</h3>
      <p>Try adjusting filters or search keyword</p>
    </div>
  ) : (
    products.filter(applyFilters).map((product) => (
      <div
        key={product.id}
        className="product-card"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img src={product.image} alt={product.name} />
        <h4>{product.name}</h4>
        <p>Brand: {product.originalBrand}</p>
        <p>₹{product.price}</p>
      </div>
    ))
  )}
</div>

        </main>
      </div>
    </div>
  );
};

export default Shop;

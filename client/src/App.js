// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/CustomNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AuthForm from './pages/AuthForm';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/CartPage';
import ReviewOrder from './components/ReviewOrder';
import DeliveryInfo from './components/DeliveryInfo';
import OrderInvoice from './pages/OrderInvoice';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/delivery-info" element={<DeliveryInfo />} />
        <Route path="/invoice" element={<OrderInvoice />} />
        <Route path="/order-history" element={<OrderHistory />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

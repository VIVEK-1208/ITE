// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/img/logo.webp" alt="Logo" className="footer-logo-img" />
          <h2 className="footer-logo-text">Industrial Tools and Equipments</h2>
        </div>

        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/shop">Products</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy">Privacy</a></li>
        </ul>

        <div className="footer-socials">
          <a href="#"><i className="fab fa-facebook-f" /></a>
          <a href="#"><i className="fab fa-twitter" /></a>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-youtube" /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Industrial Tools and Equipments. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaPhone, FaShoppingCart, FaUser } from 'react-icons/fa';
import './CustomNavbar.css';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const CustomNavbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Listen for Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Update cart count based on localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount(); // on load

    const interval = setInterval(() => {
      const lastChange = localStorage.getItem('cartChanged');
      if (lastChange !== sessionStorage.getItem('lastCartChange')) {
        sessionStorage.setItem('lastCartChange', lastChange);
        updateCartCount();
      }
    }, 500); // check every 500ms

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Signed out successfully!");
    });
  };

  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg" className="dynamic-navbar shadow">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src="/img/logo.webp"
              alt="Logo"
              height="36"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mx-auto gap-3 text-uppercase fw-semibold">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/shop">Shop</Nav.Link>
              <Nav.Link href="/about">About Us</Nav.Link>
              <Nav.Link href="/order-history">Order History</Nav.Link>
            </Nav>

            <Nav className="align-items-center gap-3">
              <Nav.Link href="/cart" className="icon-link position-relative">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Nav.Link>

              {user ? (
                <>
                  <span className="user-greeting">{user.displayName || user.email}</span>
                  <Button size="sm" variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Nav.Link href="/auth" className="icon-link"><FaUser /></Nav.Link>
              )}

              <Navbar.Text className="d-none d-lg-inline-flex text-muted">
                <FaPhone className="me-1" /> +91 7004656471
              </Navbar.Text>

              <Button variant="warning" size="sm" href="/contact">Contact Us</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;

// src/components/HeroBanner.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroBanner = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/img/hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '80vh',
        minHeight: '500px',
        position: 'relative',
        transform: 'scaleX(-1)', // flip image horizontally
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // dark overlay
          transform: 'scaleX(-1)', // flip text back
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ height: '100%' }}>
            <Col md={6} className="text-white text-start">
              <h1 style={{ fontSize: '2.8rem', fontWeight: '700' }}>
                Making the Difference in Tool Performance
              </h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '500px' }}>
                Our mission is to give customers the best experience with world-class industrial tools.
              </p>
              <a href="/contact"><Button variant="warning" size="lg">Contact Us for Tool Advice</Button></a>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HeroBanner;

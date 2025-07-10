import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './BrandLogos.css';

const brands = [
  { src: '/img/bri.png', alt: 'Bristow' },
  { src: '/img/de.jpeg', alt: 'Dewalt' },
  { src: '/img/ep.jpeg', alt: 'Eibenstock' },
  { src: '/img/kpt.jpg', alt: 'KPT' },
  { src: '/img/pol.png', alt: 'Polymak' }
];

const BrandLogos = () => {
  return (
    <div className="brand-wrapper">
      <Container className="text-center">
        <h2 className="mb-5 fw-bold text-dark">Authorised Sales & Service</h2>
        <Row className="justify-content-center g-4">
          {brands.map((brand, index) => (
            <Col key={index} xs={6} sm={4} md={2} className="d-flex justify-content-center">
              <Card className="brand-card border-0 shadow-sm p-3">
                <Card.Img
                  variant="top"
                  src={brand.src}
                  alt={brand.alt}
                  className="img-fluid"
                  style={{ objectFit: 'contain', height: '60px' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default BrandLogos;

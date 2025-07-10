// pages/Home.jsx
import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductGallery from '../components/ProductGallery';
import ProcessSteps from '../components/ProcessSteps';
import BrandLogos from '../components/BrandLogos';

const Home = () => {
  return (
    <>
      <HeroBanner />
      <ProductGallery />
      <ProcessSteps />
      <BrandLogos />
    </>
  );
};

export default Home;

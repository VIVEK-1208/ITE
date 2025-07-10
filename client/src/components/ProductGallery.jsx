import React from 'react';
import './ProductGallery.css';

const images = [
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.webp',
];

const ProductGallery = () => {
  return (
    <div className="gallery-wrapper">
      <div className="gallery">
        <img src={images[0]} alt="Tool 1" className="item item1" />
        <img src={images[1]} alt="Tool 2" className="item item2" />
        <img src={images[2]} alt="Tool 3" className="item item3" />
        <img src={images[3]} alt="Tool 4" className="item item4" />
        <img src={images[4]} alt="Tool 5" className="item item5" />
        <img src={images[5]} alt="Tool 6" className="item item6" />
      </div>
    </div>
  );
};

export default ProductGallery;

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './AddProduct.css';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    image: null,
    description: '',
    quantity: '',
    type: '',
    weight: '',
    keywords: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔁 Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_upload'); // 🔁 Replace this
    formData.append('cloud_name', 'dtiuk5awc');        // 🔁 Replace this

    const res = await fetch('https://api.cloudinary.com/v1_1/dtiuk5awc/image/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      let imageUrl = '';
      if (form.image) {
        imageUrl = await uploadToCloudinary(form.image);
      }

      const productData = {
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        image: imageUrl,
        description: form.description,
        quantity: parseInt(form.quantity),
        type: form.type,
        weight: parseFloat(form.weight),
        keywords: form.keywords.split(',').map(k => k.trim().toLowerCase()),
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'products'), productData);

      setSuccess('✅ Product added successfully!');
      setForm({
        name: '',
        brand: '',
        price: '',
        image: null,
        description: '',
        quantity: '',
        type: '',
        weight: '',
        keywords: ''
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding product:', error);
      setSuccess('❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>➕ Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>Upload Image (up to 1MB)</label>
        <div className="upload-box">
          <label htmlFor="image-upload" className="upload-label">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📤</span>
                <span>Click to Upload</span>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            hidden
          />
        </div>

        <label>Product Name</label>
        <input type="text" name="name" placeholder="NAME" required value={form.name} onChange={handleChange} />

        <label>Brand</label>
        <input type="text" name="brand" placeholder="BRAND" required value={form.brand} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" placeholder="DESCRIPTION" required value={form.description} onChange={handleChange} />

        <div className="row-fields">
          <div className="half">
            <label>Product Category</label>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Tool">Tool</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="half">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="₹----"
              required
              value={form.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row-fields">
          <div className="half">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="IN NUMBER"
              required
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="half">
            <label>Weight</label>
            <input
              type="number"
              name="weight"
              placeholder="IN KG"
              required
              value={form.weight}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Keywords (comma separated)</label>
        <input type="text" name="keywords" value={form.keywords} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'ADD'}
        </button>

        {success && <p className="add-product-message">{success}</p>}
      </form>
    </div>
  );
};

export default AddProduct;

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "messages"), formData);
      alert("✅ Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      alert("❌ Failed to send message");
      console.error(error);
    }
  };

  return (
    <div className="contact-page">
      {/* Top Banner */}
      <div className="contact-banner">
        <img src="/img/Contact-Us.png" alt="Contact Banner" className="banner-img" />
      </div>

      <div className="contact-content container">
        {/* Left Section */}
        <div className="left-section">
          <img src="/img/Contact-us-2.jpg" alt="Office" className="office-img" />
          <p className="contact-description">We are here to assist you...</p>
          <div className="contact-info">
            <div className="info-item"><span className="icon">📧</span><a href="mailto:...">support@industrialtools.com</a></div>
            <div className="info-item"><span className="icon">📞</span><a href="tel:+91700...">+91 7004656471</a></div>
            <div className="info-item"><span className="icon">📍</span><span>S-TYPE Chowk, Near Adityapur Nagar Parishad Office, Seraikela Kharsawan, Jharkhand - 831013</span></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="subject" type="text" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
          <textarea name="message" placeholder="Message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
          <button type="submit">Send Message</button>
        </form>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14723.192214440873!2d86.1592243!3d22.7887889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e495f741fc29%3A0x6871c3d1396310e3!2sIndustrial%20Tool%20%26%20Equipments!5e0!3m2!1sen!2sin!4v1719235756951!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

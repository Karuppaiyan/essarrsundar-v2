// components/ContactSection.tsx
"use client";
import React, { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Thank you ${formData.name}! Your message has been transmitted successfully. We'll respond within 24 hours.`
    );
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-header">
        <h2 className="section-title">Initialize Connection</h2>
        <p className="section-subtitle">
          Ready to transform your vision into reality? Let's connect.
        </p>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info">
          <a
            href="https://www.google.com/maps/@13.0663287,80.2137716,17z?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="info-item"
          >
            <div className="info-icon">📍</div>
            <div className="info-text">
              <h4>Location</h4>
              <p>Old No. 18, New No. 35 'D' Block, M.M.D.A. Colony, Arumbakkam, Chennai - 600 106. </p>
            </div>
          </a>

          <a href="mailto:essarrentr@gmail.com" className="info-item">
            <div className="info-icon">📧</div>
            <div className="info-text">
              <h4>Email</h4>
              <p>essarrentr@gmail.com</p>
            </div>
          </a>

          <a href="tel:+919841573100" className="info-item">
            <div className="info-icon">📱</div>
            <div className="info-text">
              <h4>Phone</h4>
              <p>(+91) 98415 73100</p>
            </div>
          </a>

          <a href="https://www.essarrsundar.com" target="_blank" rel="noopener noreferrer" className="info-item">
            <div className="info-icon">📅</div>
            <div className="info-text">
              <h4>Schedule Meeting</h4>
              <p>Book a consultation</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-btn">Transmit Message</button>
        </form>
      </div>
    </section>
  );
}

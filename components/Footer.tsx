// components/Footer.tsx
"use client";
import React from "react";
import Image from 'next/image';
import logo from '../public/images/logo.png';


const services = ["Services", "Products", "Solutions", "Careers"];
const company = ["About Us", "Our Team", "Careers", "Press Kit"];
const resources = ["Documentation", "API Reference", "Blog", "Support"];
const socials = [
  { icon: "f", href: "#" },
  { icon: "t", href: "#" },
  { icon: "in", href: "#" },
  { icon: "ig", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <a href="#home" className="logo">
              <Image src={logo} alt="ESS ARR ENTERPRISES Logo" width={190} height={160} /> </a>
          </div>
          <p className="footer-description">
            Refracting complex challenges into brilliant solutions through the convergence of art, science, and technology.
          </p>
          <div className="footer-social">
            {socials.map((s, i) => (
              <a key={i} href={s.href} className="social-icon">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <div className="footer-links">
            {services.map((link, i) => (
              <a key={i} href="#">{link}</a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4>Company</h4>
          <div className="footer-links">
            {company.map((link, i) => (
              <a key={i} href="#">{link}</a>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <div className="footer-links">
            {resources.map((link, i) => (
              <a key={i} href="#">{link}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="copyright">
          © 2026 ESS ARR ENTERPRISES. All rights reserved.
        </div>
        <div className="footer-credits">
          Proudly powered by {" "}
          <a href="https://www.Vaasumgroups.com/" rel="nofollow" target="_blank">
            Vaasumgroups.com
          </a>
        </div>
      </div>
    </footer>
  );
}

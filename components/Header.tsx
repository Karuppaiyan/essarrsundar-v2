// components/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`} id="header">
      <nav className="nav-container">
        {/* Logo */}
         <a href="#home" className="logo">
              <Image src="/images/logo.png" alt="ESS ARR ENTERPRISES" width={150} height={90} /></a>
        {/* Navigation Menu */}
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`} id="navMenu">
          <li><a href="#home" className="nav-link active">Home</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#stats" className="nav-link">What We Do</a></li>
          <li><a href="#skills" className="nav-link">Equipment Rentals</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          id="menuToggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  );
}

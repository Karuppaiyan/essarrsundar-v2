// components/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
// import Link from 'next/link';
import { Link } from "@/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations();


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
         <Link href="#home" className="logo"> <Image src="/images/logo.png" alt="ESS ARR ENTERPRISES" width={150} height={90} /></Link>
        {/* Navigation Menu */}
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`} id="navMenu">
          <li><Link href="#home" className="nav-link active">{t('Home')}</Link></li>
          <li><Link href="/#about" className="nav-link">{t('About')}</Link ></li>
          <li><Link href="/#stats" className="nav-link">{t('WhatWeDo')}</Link></li>
          <li><Link href="/rentalInventory" className="nav-link">{t('RentalInventory')}</Link></li>
          <li><Link href="/#contact" className="nav-link">{t('.Contact')}</Link></li>
        </ul>
        <LanguageSwitcher />
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

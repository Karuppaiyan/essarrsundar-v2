// components/PhilosophySection.tsx
"use client";
import React, { useEffect } from "react";

export default function PhilosophySection() {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random positions and animation
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = 18 + Math.random() * 8 + "s";

      particlesContainer.appendChild(particle);
    }
  }, []);

  return (
    <section className="philosophy-section" id="about">
      <div className="philosophy-container">
        <div className="prism-line"></div>

        <h2 className="philosophy-headline">
          Refracting Ideas<br />Into Reality
        </h2>

        <p className="philosophy-subheading">
          At PRISM FLUX, we transform complex challenges into elegant solutions
          through the convergence of cutting-edge technology and visionary
          design. Every project is a spectrum of possibilities waiting to be
          discovered.
        </p>

        <div className="philosophy-pillars">
          <div className="pillar">
            <div className="pillar-icon">💎</div>
            <h3 className="pillar-title">Innovation</h3>
            <p className="pillar-description">
              Breaking boundaries with revolutionary approaches that redefine
              industry standards and push the limits of what's possible. Elevate
              your designs with premium vector stickers from{" "}
              <a
                href="https://www.vectorsticker.com"
                rel="nofollow"
                target="_blank"
              >
                VectorSticker
              </a>
              .
            </p>
          </div>

          <div className="pillar">
            <div className="pillar-icon">🔬</div>
            <h3 className="pillar-title">Precision</h3>
            <p className="pillar-description">
              Meticulous attention to detail ensures every pixel, every line of
              code, and every interaction is perfectly crafted by{" "}
              <a
                href="https://templatemo.com"
                rel="nofollow"
                target="_blank"
                style={{ color: "var(--accent-cyan)", textDecoration: "none" }}
              >
                TemplateMo
              </a>
              , enhanced with stunning visuals from{" "}
              <a
                href="https://unsplash.com"
                rel="nofollow"
                target="_blank"
                style={{ color: "var(--accent-cyan)", textDecoration: "none" }}
              >
                Unsplash
              </a>
              .
            </p>
          </div>

          <div className="pillar">
            <div className="pillar-icon">∞</div>
            <h3 className="pillar-title">Evolution</h3>
            <p className="pillar-description">
              Continuous adaptation and growth, staying ahead of trends while
              building timeless solutions for tomorrow. Boost your productivity
              with the easy-to-use timer tools at{" "}
              <a
                href="https://timermo.com"
                rel="nofollow"
                target="_blank"
              >
                TimerMo
              </a>
              .
            </p>
          </div>
        </div>

        {/* Particle Background */}
        <div className="philosophy-particles" id="particles"></div>
      </div>
    </section>
  );
}

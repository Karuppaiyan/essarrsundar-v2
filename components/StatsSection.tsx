// components/StatsSection.tsx
"use client";
import React, { useEffect, useRef } from "react";

const statsData = [
  {
    icon: "🚀",
    target: 150,
    label: "Projects Completed",
    description:
      "Successfully delivered enterprise-level solutions across multiple industries with 100% on-time completion rate.",
  },
  {
    icon: "⚡",
    target: 99,
    label: "Client Satisfaction %",
    description:
      "Maintaining excellence through continuous feedback loops and agile development methodologies.",
  },
  {
    icon: "🏆",
    target: 25,
    label: "Industry Awards",
    description:
      "Recognized globally for innovation in digital transformation and technological advancement.",
  },
  {
    icon: "💎",
    target: 500,
    label: "Code Commits Daily",
    description:
      "Continuous integration and deployment with automated testing ensuring maximum code quality.",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateCounter = (el: HTMLElement, target: number) => {
      let current = 0;
      const duration = 2000;
      const step = target / (duration / 16);

      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toString();
          clearInterval(counter);
        } else {
          el.textContent = Math.floor(current).toString();
        }
      }, 16);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll(".stat-number");
            numbers.forEach((num) => {
              if (!num.classList.contains("animated")) {
                num.classList.add("animated");
                const target = parseInt(num.getAttribute("data-target") || "0");
                animateCounter(num as HTMLElement, target);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" id="stats" ref={sectionRef}>
      <div className="section-header">
        <h2 className="section-title">Performance Metrics</h2>
        <p className="section-subtitle">
          Real-time analytics and achievements powered by cutting-edge technology
        </p>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-number" data-target={stat.target}>
              0
            </div>
            <div className="stat-label">{stat.label}</div>
            <p className="stat-description">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

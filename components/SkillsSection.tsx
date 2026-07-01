// components/SkillsSection.tsx
"use client";
import React, { useState } from "react";

const skillsData = [
  { name: "Circular LED", icon: "⚛️", level: 95, category: "frontend" },
  { name: "LED Tree", icon: "🟢", level: 90, category: "backend" },
  { name: "Cube LED", icon: "📘", level: 88, category: "frontend" },
  { name: "Anamorphic LED", icon: "☁️", level: 92, category: "cloud" },
  { name: "Interactive screen", icon: "🐳", level: 85, category: "cloud" },
  { name: "Poster led", icon: "🐍", level: 93, category: "backend" },
  { name: "LED TV Screens", icon: "☸️", level: 82, category: "cloud" },
  { name: "LFD Wall", icon: "◈", level: 87, category: "backend" },
  { name: "Custom LED Display", icon: "🤖", level: 78, category: "emerging" },
  { name: "Dynamic LED Wall", icon: "🔗", level: 75, category: "emerging" },
  { name: "Fascia LED", icon: "💚", level: 85, category: "frontend" },
  { name: "LED Sphere", icon: "🍃", level: 90, category: "backend" },
];

export default function SkillsSection() {
  const [category, setCategory] = useState("all");

  const filteredSkills =
    category === "all"
      ? skillsData
      : skillsData.filter((skill) => skill.category === category);

  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        <div className="section-header">
          <h2 className="section-title">Featured LED Display Styles</h2>
          <p className="section-subtitle">
            creative LED display formats
          </p>
        </div>

        {/* Category Tabs */}
        <div className="skill-categories">
          {["all", "frontend", "backend", "cloud", "emerging"].map((cat) => (
            <div
              key={cat}
              className={`category-tab ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat === "all" ? "All Skills" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </div>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-hexagon-grid" id="skillsGrid">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              className="skill-hexagon"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="hexagon-inner">
                <div className="hexagon-content">
                  <div className="skill-icon-hex">{skill.icon}</div>
                  <div className="skill-name-hex">{skill.name}</div>
                  <div className="skill-level">
                    <div
                      className="skill-level-fill"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="skill-percentage-hex">{skill.level}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

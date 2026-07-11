// components/SkillsSection.tsx
"use client";
import React, { useState } from "react";

const skillsData = [
  { name: "Circular LED", icon: "⚛️", level: 95, category: "Corporate Events" },
  { name: "LED Tree", icon: "🟢", level: 90, category: "Outdoor Events" },
  { name: "Cube LED", icon: "📘", level: 88, category: "Wedding Events" },
  { name: "Anamorphic LED", icon: "☁️", level: 92, category: "Cultural Event" },
  { name: "Interactive screen", icon: "🐳", level: 85, category: "Corporate Events" },
  { name: "Poster led", icon: "🐍", level: 93, category: "Corporate Events" },
  { name: "LED TV Screens", icon: "☸️", level: 82, category: "Outdoor Events" },
  { name: "LFD Wall", icon: "◈", level: 87, category: "Cultural Event" },
  { name: "Custom LED Display", icon: "🤖", level: 78, category: "Wedding Events" },
  { name: "Dynamic LED Wall", icon: "🔗", level: 75, category: "Corporate Events" },
  { name: "Fascia LED", icon: "💚", level: 85, category: "Wedding Events" },
  { name: "LED Sphere", icon: "🍃", level: 90, category: "Cultural Event" },
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
          {["all", "Corporate Events", "Outdoor Events", "Wedding Events", "Cultural Event"].map((cat) => (
            <div
              key={cat}
              className={`category-tab ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat === "all" ? "All Skills" : cat}
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

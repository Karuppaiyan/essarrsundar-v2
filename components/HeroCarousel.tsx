// components/HeroCarousel.tsx
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
const portfolioData = [
            {
                id: 1,
                title: 'Exhibition Organizers',
                description: 'Next-generation cloud infrastructure leveraging quantum computing for unprecedented processing power.',
                image: '/images/events/image_0.jpeg',
                tech: ['Exhibitors', 'Event Companies', 'Design Agencies']
            },
            {
                id: 2,
                title: 'Exhibitors',
                description: 'Innovative solutions for showcasing products and services in a dynamic environment.',
                image: '/images/events/image_1.jpeg',
                tech: ['Digital Marketing Companies']
            },
            {
                id: 3,
                title: 'Event Companies',
                description: 'Customized event solutions tailored to meet the unique needs of each client.',
                image: '/images/events/image_2.jpeg',
                tech: ['Exhibitors', 'Design Agencies']
            },
            {
                id: 4,
                title: 'Design Agencies',
                description: 'Creative design services for immersive event experiences.',
                image: '/images/events/image_3.jpeg',
                tech: ['Design Agencies', 'Exhibitors']
            },
            {
                id: 5,
                title: 'Digital Marketing Companies',
                description: 'Strategic digital marketing solutions to promote your events and reach your target audience.',
                image: '/images/events/image_4.jpeg',
                tech: ['Digital Marketing Companies']
            }           
        ];

function getItemStyle(
  index: number,
  currentIndex: number,
  total: number,
  isMobile: boolean,
  isTablet: boolean
): React.CSSProperties {
  let offset = index - currentIndex;

  // Wrap around for continuous rotation
  if (offset > total / 2) offset -= total;
  else if (offset < -total / 2) offset += total;

  const absOffset = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;

  let spacing1 = 400, spacing2 = 600, spacing3 = 750;
  if (isMobile) {
    spacing1 = 280; spacing2 = 420; spacing3 = 550;
  } else if (isTablet) {
    spacing1 = 340; spacing2 = 520; spacing3 = 650;
  }

  const base: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transition: "all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)",
  };

  if (absOffset === 0) {
    return {
      ...base,
      transform: "translate(-50%, -50%) translateZ(0) scale(1)",
      opacity: 1,
      zIndex: 10,
    };
  } else if (absOffset === 1) {
    const translateX = sign * spacing1;
    const rotation = isMobile ? 25 : 30;
    const scale = isMobile ? 0.88 : 0.85;
    return {
      ...base,
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(-200px) rotateY(${-sign * rotation}deg) scale(${scale})`,
      opacity: 0.8,
      zIndex: 5,
    };
  } else if (absOffset === 2) {
    const translateX = sign * spacing2;
    const rotation = isMobile ? 35 : 40;
    const scale = isMobile ? 0.75 : 0.7;
    return {
      ...base,
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(-350px) rotateY(${-sign * rotation}deg) scale(${scale})`,
      opacity: 0.5,
      zIndex: 3,
    };
  } else if (absOffset === 3) {
    const translateX = sign * spacing3;
    const rotation = isMobile ? 40 : 45;
    const scale = isMobile ? 0.65 : 0.6;
    return {
      ...base,
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(-450px) rotateY(${-sign * rotation}deg) scale(${scale})`,
      opacity: 0.3,
      zIndex: 2,
    };
  } else {
    return {
      ...base,
      transform: "translate(-50%, -50%) translateZ(-500px) scale(0.5)",
      opacity: 0,
      zIndex: 1,
    };
  }
}


export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 1200 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = useTranslations("hero");

  const total = portfolioData.length;
  const isMobile = windowSize.width <= 768;
  const isTablet = windowSize.width <= 1024;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotate
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  // Reset timer on manual navigation
  const goToSlide = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(index);
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const handlePrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    prevSlide();
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    nextSlide();
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  // Track window size
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  
  useEffect(() => {
  const handleTouch = (e: TouchEvent) => {
    const touchStartX = e.changedTouches[0].clientX;
    const handleEnd = (endEvent: TouchEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) handleNext();
      if (touchEndX - touchStartX > 50) handlePrev();
    };
    document.addEventListener("touchend", handleEnd, { once: true });
  };
  document.addEventListener("touchstart", handleTouch);
  return () => document.removeEventListener("touchstart", handleTouch);
}, []);

  return (
    <section className="hero" id="home">
      
      <div className="carousel-container">
        <div
          className="carousel"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {portfolioData.map((item, index) => {
            const style = getItemStyle(index, currentIndex, total, isMobile, isTablet);
            return (
              <div
                key={item.id}
                className="carousel-item"
                data-index={index}
                style={style}
              >
                <div className="card">
                  <div className="card-number">{item.id}</div>
                  <div className="card-image">
                    {/* <img src={item.image} alt={item.title} /> */}
                    <Image src={item.image} alt={item.title} width={600} height={600} className="responsive-img" />

                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                  <div className="card-tech">
                    {item.tech.map((t) => (
                      <span key={t} className="tech-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="card-cta">Explore</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={handlePrev}>‹</button>
          <button className="carousel-btn" onClick={handleNext}>›</button>
        </div>

        {/* Indicators */}
        {/* <div className="carousel-indicators" id="indicators">
          {portfolioData.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}


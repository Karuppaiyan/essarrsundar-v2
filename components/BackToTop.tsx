"use client";

import { useEffect, useState, CSSProperties } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop({ threshold = 300 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const style: CSSProperties = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    borderRadius: "9999px",
    padding: "12px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ff3333",
    
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    pointerEvents: visible ? "auto" : "none",
  };

  return (
    <button onClick={scrollToTop} aria-label="Back to top" style={style}>
      <ArrowUp size={20} />
    </button>
  );
}

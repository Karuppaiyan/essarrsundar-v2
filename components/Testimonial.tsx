"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Arun Kumar",
    role: "Event Manager",
    quote:
      "The LED screens from ESS ARR Enterprises transformed our event. The clarity and immersive experience were unmatched.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Wedding Planner",
    quote:
      "Their rental service was seamless. Setup was quick, and the visuals added a magical touch to the wedding stage.",
  },
  {
    id: 3,
    name: "Rahul Mehta",
    role: "Corporate Client",
    quote:
      "Professional team and cutting-edge equipment. Our product launch looked spectacular thanks to their LED walls.",
  },
];

export default function TestimonialCarousel() {
  return (
    <section className="testimonial-section">
      <h2 className="testimonial-title">What Our Clients Say</h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="testimonial-swiper"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id} className="testimonial-slide">
            <div className="testimonial-card">
              <p className="testimonial-quote">“{t.quote}”</p>
              <h4 className="testimonial-name">{t.name}</h4>
              <span className="testimonial-role">{t.role}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
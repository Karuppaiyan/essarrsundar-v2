"use client";
import Image from 'next/image'
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";

export default function AquaticCarousel() {
  return (
    <section className="hero" id="home">
       <br />
      <br />
      <main>
        <div className="section-header">
          <span>discover</span>
                <h1 className="section-title">We Build Next Gen Event Experiences</h1>
                <p className="section-subtitle">
                  We are a dedicated agile team of highly skilled technicians, supervisors, managers and workers alike who are trained to handle the most demanding events. We bring expertise of international standards and ethics into our style of working.
                </p>
                <a href="#">Learn More</a>
              </div>
        
      <br />
      <br />
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        keyboard={{ enabled: true }}
        mousewheel={{ thresholdDelta: 70 }}
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
          1560: { slidesPerView: 3 },
        }}
        modules={[EffectCoverflow, Pagination, Keyboard, Mousewheel]}
        className="swiper"
      >
        <SwiperSlide className="swiper-slide swiper-slide--one">
                  <div>
                    <h2>Exhibition Organizers</h2>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--two">
                  <div>
                    <h2>Exhibitors</h2>
                    
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--three">
                  <div>
                    <h2>Event Companies</h2>
                   
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--four">
                  <div>
                    <h2>Design Agencies</h2>
                   
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--five">
                  <div>
                    <h2>Digital Marketing Companies</h2>
                    
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
      </Swiper>
      </main>
    </section>
  );
}

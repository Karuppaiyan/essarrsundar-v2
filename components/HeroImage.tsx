"use client";
import Image from 'next/image'
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslations } from "next-intl";
import { EffectCoverflow, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import "../app/[locale]/page.module.css"; // Import the global CSS file

 
export default function HeroImage() {
  const t = useTranslations("hero");


  return (
    <section className="hero" id="services">
       <br />
      <br />
      <main>
        <div className="section-header">
          <span>discover</span>
                <h1 className="section-title">{t('title')}</h1>
                <p className="section-subtitle">
                  {t('subtitle')}
                </p>
                <a href="#">{t('learnMore')}</a>
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
                    <p className="card-description">Next-generation cloud infrastructure leveraging quantum computing for unprecedented processing power.</p>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--two">
               
                  <div>
                    <h2>Exhibitors</h2>
                    <p className="card-description">Innovative solutions for showcasing products and services in a dynamic environment.</p>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--three" style={{}}>
               
                  <div>
                    <h2>Event Companies</h2>
                    <p className="card-description">Customized event solutions tailored to meet the unique needs of each client.</p>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--four">
               
                  <div>
                    <h2>Design Agencies</h2>
                    <p className="card-description">Creative design services for immersive event experiences.</p>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
        
                <SwiperSlide className="swiper-slide swiper-slide--five">
                  <div>
                    <h2>Digital Marketing Companies</h2>
                    <p className="card-description">Strategic digital marketing solutions to promote your events and reach your target audience.</p>
                    <a href="#" target="_blank">Explore</a>
                  </div>
                </SwiperSlide>
      </Swiper>
      </main>
    </section>
  );
}

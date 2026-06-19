"use client";

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
      <main>
        <div> <span>discover</span>
          <h1>We Build Next Gen Event Experiences</h1>
          <p>We are a dedicated agile team of highly skilled technicians, supervisors, managers and workers alike who are trained to handle the most demanding events. We bring expertise of international standards and ethics into our style of working.</p>
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
            <h2>Jellyfish</h2>
            <p>
              Jellyfish and sea jellies are the informal common names given to the medusa-phase of certain gelatinous members of the subphylum Medusozoa.
            </p>
            <a href="https://en.wikipedia.org/wiki/Jellyfish" target="_blank">Explore</a>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide swiper-slide--two">
          <div>
            <h2>Seahorse</h2>
            <p>
              Seahorses are mainly found in shallow tropical and temperate salt water throughout the world. They live in sheltered areas such as seagrass beds, estuaries, coral reefs, and mangroves.
            </p>
            <a href="https://en.wikipedia.org/wiki/Seahorse" target="_blank">Explore</a>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide swiper-slide--three">
          <div>
            <h2>Octopus</h2>
            <p>
              Octopuses inhabit various regions of the ocean, including coral reefs, pelagic waters, and the seabed; some live in the intertidal zone and others at abyssal depths.
            </p>
            <a href="https://en.wikipedia.org/wiki/Octopus" target="_blank">Explore</a>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide swiper-slide--four">
          <div>
            <h2>Shark</h2>
            <p>
              Sharks are a group of elasmobranch fish characterized by a cartilaginous skeleton, five to seven gill slits, and pectoral fins not fused to the head.
            </p>
            <a href="https://en.wikipedia.org/wiki/Shark" target="_blank">Explore</a>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide swiper-slide--five">
          <div>
            <h2>Dolphin</h2>
            <p>
              Dolphins are widespread. Most species prefer warm waters, but some prefer colder climates. They feed largely on fish and squid.
            </p>
            <a href="https://en.wikipedia.org/wiki/Dolphin" target="_blank">Explore</a>
          </div>
        </SwiperSlide>
      </Swiper>
      </main>
    </section>
  );
}

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {Pagination} from "swiper/modules";
import AppCard from "./AppCard";
import "./Carousel.scss";

interface App {
  name: string;
  description: string;
  icon?: string;
}

interface Props {
    apps: App[];
    onAppSelected: (index: number) => void;
}

const AppCarousel = ({apps, onAppSelected}: Props) => {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={2}
      centeredSlides={true}
      grabCursor={true}
      breakpoints={{
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      pagination={{
        clickable: true,
      }}
    >
      {apps.map((app, index) => (
        <SwiperSlide key={index}>
          <AppCard index={index} title={app.name} description={app.description} icon={app.icon} onSelected={onAppSelected}  />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default AppCarousel;

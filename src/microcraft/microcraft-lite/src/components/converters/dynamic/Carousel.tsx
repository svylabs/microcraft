import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
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

const AppCarousel = ({ apps, onAppSelected }: Props) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation]}
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
        navigation={{
          nextEl: ".swiper-butt-next",
          prevEl: ".swiper-butt-prev",
        }}
        className="swiper-container"
      >
        {apps.map((app, index) => (
          <SwiperSlide key={index}>
            <AppCard
              index={index}
              title={app.name}
              description={app.description}
              icon={app.icon}
              onSelected={onAppSelected}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left and Right Navigation Buttons */}
      {/* <div className="swiper-button-prev absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-7 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg">
      </div>
      <div className="swiper-button-next absolute top-1/2 right-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-7 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg">
      </div> */}
      <div className="swiper-butt-prev absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-2 px-3 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg">
        &#8592;
      </div>
      <div className="swiper-butt-next absolute top-1/2 right-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-2 px-3 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg">
        &#8594;
      </div>
    </div>
  );
};

export default AppCarousel;
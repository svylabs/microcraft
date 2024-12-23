import React, { useState } from "react";
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
  name: string;
  description: string;
  apps: App[];
  onAppSelected: (index: number) => void;
}

const AppCarousel = ({ name, description, apps, onAppSelected }: Props) => {
  const [swiperIndex, setSwiperIndex] = useState(0);

  // Function to handle swiper index change
  const handleSlideChange = (swiper: any) => {
    setSwiperIndex(swiper.realIndex);
  };

  return (
    <div className="items-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{name}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
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
        onSlideChange={handleSlideChange}
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
      <div
        className={`swiper-butt-prev absolute top-1/2 left-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-2 px-3 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg ${
          swiperIndex === 0 ? "blur-sm" : ""
        }`}
      >
        &#8592;
      </div>
      <div
        className={`swiper-butt-next absolute top-1/2 right-4 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 p-2 px-3 rounded-full text-white z-10 cursor-pointer transition-transform transform hover:scale-110 shadow-lg ${
          swiperIndex === apps.length - 1 ? "blur-sm" : ""
        }`}
      >
        &#8594;
      </div>
    </div>
    </div>
  );
};

export default AppCarousel;

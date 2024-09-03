import React, { useEffect, useState, useRef } from "react";
import ConnectToWallet from "./ConnectToWallet";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest(".header-menu-toggle")) {
          setIsMenuOpen(false);
          // if (window.innerWidth >= 768) {
          //   setIsMenuOpen(false);
          // }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 bg-white z-auto flex justify-between">
        <div className="flex gap-1 md:gap-3 lg:gap-5 items-center">
          <img
            src="/microcraft.png"
            alt="Microcraft"
            className="w-10 h-10 lg:w-16 lg:h-16"
          />
          <h2 className="flex flex-col py-2 text-2xl md:text-3xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 overflow-hidden">
            Microcraft
            <span className="text-xs md:text-sm lg:text-base font-light text-transparent whitespace-nowrap">
              Open UI/UX for DeFi
            </span>
          </h2>
        </div>
        <div className="hidden md:flex items-center">
          <ul className="flex gap-3 lg:gap-5">
            <li className="group relative">
              <a
                href="#"
                className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
              >
                Home
              </a>
              <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="group relative">
              <a
                href="#"
                className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
              >
                Features
              </a>
              <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="group relative">
              <a
                href="#"
                className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
              >
                Resources
              </a>
              <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          </ul>
        </div>

        <div className="flex gap-5 items-center">

          <div className="hidden md:flex justify-center items-center gap-1 md:gap-3">
              <div className="flex gap-3 items-center cursor-pointer">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 shadow-lg">
                  <span
                    className="text-gray-600 cursor-pointer text-[10px]"
                  >
                    Avatar
                  </span>
                </div>
              </div>
          </div>
          <button
            onClick={toggleMenu}
            className="header-menu-toggle focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 md:w-8 md:h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 md:w-8 md:h-8 text-slate-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <>
          <div className="block relative">
            <div ref={modalRef} className="absolute right-1 md:right-0 bg-slate-200 p-3 md:p-2 rounded max-w-xs">
              <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-center cursor-pointer">
                    <div className="w-10 h-10 md:w-11 md:h-11 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 shadow-lg">
                      <span
                        className="text-gray-600 cursor-pointer text-[12px]"
                      >
                        Avatar
                      </span>
                    </div>
                    <p className="flex self-center items-center text-[#092C4C] text-lg">
                      <span className="text-base mr-2">Hello! </span>
                      <span className="font-bold">Guest</span>
                    </p>
                  </div>
                <ConnectToWallet />
              </div>
              <hr className="md:hidden border border-t-slate-500 my-3"></hr>
              <div className="flex md:hidden items-center">
                <ul className="flex flex-col gap-3">
                  <li className="group relative">
                    <a
                      href="#"
                      className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
                    >
                      Home
                    </a>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </li>
                  <li className="group relative">
                    <a
                      href="#"
                      className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
                    >
                      Features
                    </a>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </li>
                  <li className="group relative">
                    <a
                      href="#"
                      className="text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-300"
                    >
                      Resources
                    </a>
                    <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

    </>
  );
};
export default Header;

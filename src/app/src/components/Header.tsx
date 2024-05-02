import React, { useEffect, useState, useRef } from "react";
import LoginSignupModal from "./LoginSignupModal";
import { BASE_API_URL } from "./constants";
import ConnectToWallet from "./ConnectToWallet";

const Header: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/user`, {
        credentials: "include",
      });
      if (response.ok) {
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();
          setUserName(userData.name || userData.login);
          setUserAvatar(userData.avatar_url);
          localStorage.setItem("userDetails", JSON.stringify(userData));
        } else {
          console.error("Response is not valid JSON");
        }
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-50 flex justify-between">
        <div className="flex gap-1 md:gap-3 lg:gap-5 items-center">
          <img
            src="/microcraft.png"
            alt="Microcraft"
            className="w-10 h-10 lg:w-16 lg:h-16"
          />
          <h2 className="flex flex-col py-2 text-2xl md:text-3xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 overflow-hidden">
            Microcraft
            <span className="text-xs md:text-sm lg:text-base font-light text-transparent whitespace-nowrap">
               Intent centric web3 apps
            </span>
          </h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
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
                className="h-7 w-7"
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
        <div className="hidden md:flex justify-center items-center gap-1 md:gap-3">
          <div className="flex gap-3 self-center">
            {userName !== "" && (
              <div className="flex gap-3 self-center">
                <img
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer transform hover:scale-110 shadow-lg"
                  src={userAvatar}
                  alt={userName}
                  onClick={handleLogin}
                ></img>
                <p className="hidden md:flex self-center text-[#092C4C] text-lg xl:text-xl">
                  <span className="font-bold">Hello!</span> {userName}
                </p>
              </div>
            )}
            {userName === "" && (
              <div className="flex gap-3 self-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 shadow-lg">
                  <span className="text-gray-600" onClick={handleLogin}>
                    Avatar
                  </span>
                </div>
                <p className="hidden md:flex self-center text-[#092C4C] text-lg xl:text-xl">
                  <span className="font-bold">Hello!</span> Guest
                </p>
              </div>
            )}
          </div>
          <ConnectToWallet />
        </div>
      </header>
      {isMenuOpen && (
        <div className="bg-slate-200 p-2 rounded md:hidden">
          <div className="flex flex-col  gap-3">
            {userName !== "" ? (
              <div className="flex gap-3 items-center">
                <img
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer transform hover:scale-110 shadow-lg"
                  src={userAvatar}
                  alt={userName}
                  onClick={handleLogin}
                ></img>
                <p className="text-[#092C4C] text-lg xl:text-xl">
                  <span className="font-bold">Hello!</span> {userName}
                </p>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 shadow-lg">
                  <span
                    className="text-gray-600 cursor-pointer"
                    onClick={handleLogin}
                  >
                    Avatar
                  </span>
                </div>
                <p className="text-[#092C4C] text-lg xl:text-xl">
                  <span className="font-bold">Hello!</span> Guest
                </p>
              </div>
            )}
            <ConnectToWallet />
          </div>
        </div>
      )}

      {isModalOpen && <LoginSignupModal closeModal={closeModal} />}
    </>
  );
};
export default Header;

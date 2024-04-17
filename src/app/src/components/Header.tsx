import React, { useEffect, useState } from "react";
import LoginSignupModal from "./LoginSignupModal";
import { BASE_API_URL } from "./constants";
import SharePage from "./share/SharePage";

const Header: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 bg-white z-50 flex flex-wrap justify-between">
          <div className="flex gap-2 md:gap-3 lg:gap-5 items-center">
            <img
              src="/microcraft.png"
              alt="Microcraft"
              className="w-10 h-10 lg:w-16 lg:h-16"
            />
            <h2 className="flex flex-col py-2 text-2xl md:text-3xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">
              Microcraft
              <span className="text-xs md:text-3sm lg:text-base font-light text-transparent">
                Minimum distraction, maximum utility
              </span>
            </h2>
          </div>
          <div>
          {/* <SharePage /> */}
          </div>
          <div className="flex gap-3 self-center">
            {userName !== "" && (
              <div className="flex gap-3 self-center">
                <img
                  className="w-12 h-12 rounded-full cursor-pointer transform hover:scale-110 shadow-lg"
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
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 shadow-lg">
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
      </header>
      {isModalOpen && <LoginSignupModal closeModal={closeModal} />}
    </>
  );
};
export default Header;

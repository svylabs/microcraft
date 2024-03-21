import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL, GITHUB_CLIENT_ID } from "./constants";

const LoginSignupModal = ({ closeModal }: { closeModal: () => void }) => {
  const [userData, setUserData] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData();

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeModal]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();
          setUserData(userData);
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

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setUserData(null); // Reset user data
        closeModal();
        window.location.reload(); // Reload the page after logout
      } else {
        console.error("Failed to logout:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-md p-4 md:p-8 w-full max-w-md"
      >
        <span
          className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-500 text-2xl rounded-full  pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-700 hover:text-white hover:scale-110"
          onClick={closeModal}
        >
          &times;
        </span>

        {userData ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {userData.login}
            </h2>
            <p className="text-gray-600 mb-4">
              Created on: {userData.created_on}
            </p>
            <img
              className="mx-auto w-32 h-32 rounded-full object-cover mb-4"
              src={userData.avatar_url}
              alt="User Avatar"
            />
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md xl:text-xl px-4 py-2 font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5 bg-gray-100 rounded-md shadow-md">
            <p className="text-[#727679] mb-4 text-center font-medium">
              Elevate your experience! Sign in to build and publish custom apps.
            </p>

            <a
              href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
              className="mx-auto md:mx-0"
            >
              <button
                className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                type="submit"
              >
                Login with GitHub
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupModal;

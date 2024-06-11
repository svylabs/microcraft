import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL, GITHUB_CLIENT_ID } from "./constants";
import GoogleLogo from "./photos/google-icon.svg";
import GithubLogo from "./photos/github-icon.svg";

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
        localStorage.removeItem("userDetails");
        window.location.reload(); // Reload the page after logout
      } else {
        console.error("Failed to logout:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/google/login`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        closeModal();
      } else {
        console.error("Failed to login with Google:", response.status);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-md p-4 md:p-8 w-full max-w-md relative"
        // relative
      >
        <span
          className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-300 text-2xl rounded-full  pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-500 hover:text-white hover:scale-110"
          onClick={closeModal}
        >
          &times;
        </span>

        {userData ? (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-2xl font-bold ">Welcome, {userData.login}</h2>
            <p className="text-gray-600 ">Created on: {userData.created_on}</p>
            <img
              className="mx-auto w-32 h-32 rounded-full object-cover "
              src={userData.avatar_url}
              alt="User Avatar"
            />
            <button
              onClick={handleLogout}
              className="mx-auto cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md xl:text-xl px-4 py-2 font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5 bg-gray-100 rounded-md shadow-md">
            <p className="text-[#727679] mb-4 text-center font-medium">
              Elevate your experience! Sign in to build and publish custom apps.
            </p>

            <div className="flex flex-col space-y-4">
              <a
                href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`}
                className="mx-auto md:mx-0 w-full"
              >
                <button
                  className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
                  type="submit"
                >
                  <img
                    src={GithubLogo}
                    alt="MetaMask Logo"
                    className="w-6 h-6 mr-2 "
                  />{" "}
                  Login with GitHub
                </button>
              </a>

              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
              >
                <img
                  src={GoogleLogo}
                  alt="MetaMask Logo"
                  className="w-6 h-6 mr-2 "
                />{" "}
                Login with Google
              </button>

              {/* <button
                onClick={handleEmailSignup}
                className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
              >
                Signup with Email
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupModal;

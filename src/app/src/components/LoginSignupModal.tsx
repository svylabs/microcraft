import React, { useState, useEffect } from "react";

const LoginSignupModal = ({ closeModal }: { closeModal: () => void }) => {
  // State to store the user ID retrieved from cookies
  const [userId, setUserId] = useState<string | null>(null);

  // Function to read cookies and update state
  useEffect(() => {
    // Function to retrieve the value of a cookie by its name
    const getCookie = (name: string) => {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    };

    // Read the value of the 'userid' cookie
    const userIdFromCookie = getCookie('userid');
    setUserId(userIdFromCookie);
  }, []);

  const handleRedirect = () => {
    if (userId) {
      // User is logged in, redirect to the add component page
      window.location.href = "http://localhost:5173/converter/Custom%20Components";
    } else {
      // User is not logged in, redirect to the login with GitHub page
      window.location.href = "https://github.com/login/oauth/authorize?client_id=585042cc21ce245f7c54";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 md:p-8 w-full max-w-md">
        <span
          className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-500 text-2xl rounded-full  pb-1 px-2.5 transition duration-300 hover:bg-gray-700 hover:text-white"
          onClick={closeModal}
        >
          &times;
        </span>
        
        <button onClick={handleRedirect}>Login with GitHub</button>
      </div>
    </div>
  );
};

export default LoginSignupModal;

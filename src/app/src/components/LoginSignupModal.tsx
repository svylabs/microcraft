import React, { useState } from "react";

const LoginSignupModal = ({ closeModal }: { closeModal: () => void }) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);

  const handleToggleForms = (formType: string) => {
    setShowLoginForm(formType === "login");
    setShowSignupForm(formType === "signup");
    setShowForgotForm(formType === "forgot");
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
        {showLoginForm && (
          <div className="form">
            <header className="text-2xl font-bold mb-4">Login</header>
            <form>
              <input
                type="text"
                id="inUsr"
                placeholder="Enter your email"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                id="inPass"
                placeholder="Enter your password"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <a
                href="#"
                id="forgotLabel"
                className="text-blue-500 mb-4 inline-block"
                onClick={() => handleToggleForms("forgot")}
              >
                Forgot password?
              </a>
              <input
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                value="Login"
              />
            </form>
            <div className="mt-4 text-center">
              <span>Don't have an account?</span>
              <a
                href="#"
                id="signupLabel"
                className="text-blue-500 ml-1"
                onClick={() => handleToggleForms("signup")}
              >
                Signup
              </a>
            </div>
          </div>
        )}

        {showSignupForm && (
          <div className="form">
            <header className="text-2xl font-bold mb-4">Signup</header>
            <form>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                value="Signup"
              />
            </form>
            <div className="mt-4 text-center">
              <span>Already have an account?</span>
              <a
                href="#"
                id="loginLabel"
                className="text-blue-500 ml-1"
                onClick={() => handleToggleForms("login")}
              >
                Login
              </a>
            </div>
          </div>
        )}

        {showForgotForm && (
          <div className="form">
            <header className="text-2xl font-bold mb-4">Forgot Password</header>
            <form>
              <input
                type="text"
                id="forgotinp"
                placeholder="Enter your email"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                value="Submit"
              />
            </form>
            <div className="mt-4 text-center">
              <span>Don't have an account?</span>
              <a
                href="#"
                id="signupLabel"
                className="text-blue-500 ml-1"
                onClick={() => handleToggleForms("signup")}
              >
                Signup
              </a>
            </div>
            <div className="mt-2 text-center">
              <span>Already have an account?</span>
              <a
                href="#"
                id="loginLabel"
                className="text-blue-500 ml-1"
                onClick={() => handleToggleForms("login")}
              >
                Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupModal;

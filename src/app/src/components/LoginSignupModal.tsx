import React from "react";

const LoginSignupModal = ({ closeModal }: { closeModal: () => void }) => {

  return (
    <div className="flex flex-col justify-center items-center fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh] z-50">
          <div className="bg-white rounded-md font-serif p-1 py-8 md:p-2 xl:p-4 flex flex-col justify-center items-center w-[20rem] md:w-[25rem] md:h-[20rem] lg:w-[30rem] lg:p-6 xl:w-[36rem] gap-3">
        <span className="bg-slate-500 p-0.5 px-2.5 text-2xl rounded just" onClick={closeModal}>&times;</span>
        <h2>Login / Signup</h2>
      </div>
    </div>
  );
};

export default LoginSignupModal;

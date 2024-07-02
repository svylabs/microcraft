import React, { useState, useEffect, useRef } from "react";
import apiKeysIcon from "../photos/carbon--api-key.svg";
import ManageApiKeysSelector from "./ManageApiKeysSelector";

const ManageApiKeysModal = () => {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowApiKeys(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleManageApiKeys = () => {
    setShowApiKeys((prevState) => !prevState);
  };

  return (
    <div ref={modalRef}>
      <button
        onClick={handleManageApiKeys}
        className="common-button flex gap-3 text-lg items-center justify-center cursor-pointer"
        title="Click to expand Api Keys"
      >
        <img
          src={apiKeysIcon}
          alt="apiKeysIcon"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full p-1.5 bg-slate-100 hover:scale-110 shadow-lg font-extrabold"
        />
        <span>Manage Api Keys</span>
      </button>

      {showApiKeys && <ManageApiKeysSelector setShowApiKeys={setShowApiKeys} />}
    </div>
  );
};

export default ManageApiKeysModal;

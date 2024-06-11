import React, { useState, useEffect, useRef } from "react";
import usersIcon from "../photos/users-solid.svg";
import AppVisibilitySelector from "./AppVisibilitySelector";

const AppVisibleModal = () => {
  const [showTeams, setShowTeams] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowTeams(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleManageTeams = () => {
    setShowTeams((prevState) => !prevState);
  };

  return (
    <div ref={modalRef} className="z-50">
      <button
        onClick={handleManageTeams}
        className="common-button flex gap-3 text-lg items-center justify-center cursor-pointer"
        title="Manage Teams"
      >
        <img
          src={usersIcon}
          alt="usersIcon"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full p-1.5 bg-slate-100 hover:scale-110 shadow-lg "
        />
        <span className="md:hidden">Manage Teams</span>
      </button>

      {showTeams && <AppVisibilitySelector setShowTeams={setShowTeams} />}
    </div>
  );
};

export default AppVisibleModal;

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedin,
  faGooglePlus,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import "./SharePage.css";
import { faShareAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

const SharePage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setInitialPositionByScreenSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let initialX, initialY;

      if (screenWidth <= 426) {
        initialX = screenWidth - 58;
        initialY = screenHeight - 453;
      } else if (screenWidth <= 768) {
        initialX = screenWidth / 1.57;
        initialY = screenHeight / 25;
      } else if (screenWidth <= 1024) {
        initialX = screenWidth / 1.4;
        initialY = screenHeight / 17;
      } else if (screenWidth <= 1440) {
        initialX = screenWidth / 1.06;
        initialY = screenHeight / 25;
      } else {
        initialX = screenWidth / 1.09;
        initialY = screenHeight / 21;
      }

      setInitialPosition({ x: initialX, y: initialY });
      setPosition({ x: initialX, y: initialY });
    };

    setInitialPositionByScreenSize();
    window.addEventListener("resize", setInitialPositionByScreenSize);
    return () => {
      window.removeEventListener("resize", setInitialPositionByScreenSize);
    };
  }, []);

  useEffect(() => {
    if (dragging) {
      const onMouseMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - initialPosition.x;
        const deltaY = clientY - initialPosition.y;
        setPosition({ x: position.x + deltaX, y: position.y + deltaY });
        setInitialPosition({ x: clientX, y: clientY });
      };

      const onMouseUp = () => {
        setDragging(false);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onMouseMove, { passive: false });
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onMouseUp);

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchend", onMouseUp);
      };
    }
  }, [dragging, initialPosition, position]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setInitialPosition({ x: clientX, y: clientY });
  };

  const handleShareClick = () => {
    setIsActive(!isActive);
  };

  const getMessage = () => {
    if (window.location.href.includes("/app/inbuilt")) {
      return encodeURIComponent("Discover something amazing! 🚀 Check it out! @");
    } else {
      return encodeURIComponent("#BuildWithMicrocraft - Unleash creativity! 🛠️💡");
    }
  };

  const shareFacebook = () => {
    const message = getMessage();
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?quote=${message}${url}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    const message = getMessage();
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${message}${url}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    const message = getMessage();
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${message}`,
      "_blank"
    );
  };

  const shareWhatsApp = () => {
    const message = getMessage();
    const url = encodeURIComponent(window.location.href);
    window.open(`whatsapp://send?text=${message}${url}`, "_blank");
  };

  const shareGooglePlus = () => {
    const message = getMessage();
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://plus.google.com/share?url=${url}&text=${message}`,
      "_blank"
    );
  };

  // const sharePage = async () => {
  //   try {
  //     // Check if Web Share API is supported
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: "Share Page",
  //         url: window.location.href,
  //       });
  //     } else {
  //       // Fallback if Web Share API is not supported
  //       alert("Web Share API is not supported in your browser.");
  //     }
  //   } catch (error) {
  //     console.error("Error sharing page:", error);
  //   }
  // };

  return (
    <>
      <div className="share-page" style={{ top: position.y, left: position.x }}>
        <div
          className={`share ${isActive ? "active" : ""}`}
          onClick={handleShareClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {isActive ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faShareAlt} />
          )}
        </div>
        <ul className={`social ${isActive ? "active" : "hidden"}`}>
          <li>
            <button onClick={shareFacebook} title="facebook">
              <FontAwesomeIcon icon={faFacebookF} className="facebook" />
            </button>
          </li>
          <li>
            <button onClick={shareTwitter} title="twitter">
              <FontAwesomeIcon icon={faTwitter} className="twitter" />
            </button>
          </li>
          <li>
            <button onClick={shareLinkedIn} title="linkedin">
              <FontAwesomeIcon icon={faLinkedin} className="linkedin" />
            </button>
          </li>
          <li>
            <button onClick={shareWhatsApp} title="whatsapp">
              <FontAwesomeIcon icon={faWhatsapp} className="whatsapp" />
            </button>
          </li>
          <li>
            <button onClick={shareGooglePlus} title="google">
              <FontAwesomeIcon icon={faGooglePlus} className="google" />
            </button>
          </li>
        </ul>
      </div>
      {/* <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        onClick={sharePage}
      >
        Share Page
      </button> */}
    </>
  );
};

export default SharePage;

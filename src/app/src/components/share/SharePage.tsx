import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedin, faGooglePlus, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./SharePage.css";
import { faShareAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

const SharePage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleShareClick = () => {
    setIsActive(!isActive);
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

  const shareFacebook = () => {
    const message = encodeURIComponent("Check out this awesome page! @ ");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?quote=${message}${url}`,
      "_blank"
    );
  };
  
  const shareTwitter = () => {
    const message = encodeURIComponent("Check out this awesome page! @ ");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${message}${url}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    const message = encodeURIComponent("Check out this awesome page! @ ");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${message}`,
      "_blank"
    );
  };
  
  const shareWhatsApp = () => {
    const message = encodeURIComponent("Check out this awesome page! @ ");
    const url = encodeURIComponent(window.location.href);
    window.open(`whatsapp://send?text=${message}${url}`, "_blank");
  };

  const shareGooglePlus = () => {
    const message = encodeURIComponent("Check out this awesome page! @ ");
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://plus.google.com/share?url=${url}&text=${message}`,
      "_blank"
    );
  };

  return (
    <>
      <div className="share-wrapper">
        <div className={`share ${isActive ? 'active' : ''}`} onClick={handleShareClick}>
          {isActive ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faShareAlt} />}
        </div>
        <ul className={`social ${isActive ? 'active' : ''}`}>
          <li><button onClick={shareFacebook} title="facebook"><FontAwesomeIcon icon={faFacebookF} className="facebook" /></button></li>
          <li><button onClick={shareTwitter} title="twitter"><FontAwesomeIcon icon={faTwitter} className="twitter" /></button></li>
          <li><button onClick={shareLinkedIn} title="linkedin"><FontAwesomeIcon icon={faLinkedin} className="linkedin" /></button></li>
          <li><button onClick={shareWhatsApp} title="whatsapp"><FontAwesomeIcon icon={faWhatsapp} className="whatsapp" /></button></li>
          <li><button onClick={shareGooglePlus} title="google"><FontAwesomeIcon icon={faGooglePlus} className="google" /></button></li>
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

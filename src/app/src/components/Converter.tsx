import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import crossImage from "./photos/xmark-solid.svg";
import JsonStringConverter from "./converters/json/JsonStringConverter";
import PrettyJsonConverter from "./converters/json/PrettyJsonConverter";
import JsonDiffConverter from "./converters/json/JsonDiffConverter";
import EncodeDataConverters from "./converters/base64/EncodingDecodingConverter";
import DecodeDataConverters from "./converters/base64/EncodeImageFileConverters";
import GeneralContextProvider from "./converters/pdfProcessing/imageToPdf/GeneralContextProvider";
import ImageToPdfConverter from "./converters/pdfProcessing/imageToPdf/ImageToPdfConverter";
import MergePdfConverter from "./converters/pdfProcessing/mergePdf/MergePdfConverter";
import EllipticCurveCryptography from "./converters/cryptographyTools/EllipticCurveCryptography";
import CryptographicHash from "./converters/cryptographyTools/CryptographicHash";
import BLSSignatures from "./converters/cryptographyTools/BLSSignatures";
import EncryptionDecryption from "./converters/cryptographyTools/EncryptionDecryption";
import ECDHKeySharing from "./converters/cryptographyTools/ECDHKeySharing";
import ImageEditor from "./converters/imageProcessing/ImageEditor";
import ConfigureBasicDetails from "./converters/dynamic/ConfigureBasicDetails";
import RequestAnApp from "./converters/suggestionApp/RequestAnApp";
import headingIcon from "./photos/heading.png"

interface ConverterProps {
  id: string;
}

const Converter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (id === "Secure-Pdf") {
      fetch("../../public/index.html")
        .then((response) => response.text())
        .then((html) => setHtmlContent(html))
        .catch((error) => console.error("Error fetching HTML:", error));
    }
  }, [id]);

  const renderConverterContent = () => {
    switch (id) {
      case "JSON ⇔ String":
        return <JsonStringConverter />;
      case "JSON Formatter":
        return <PrettyJsonConverter />;
      case "JSON Diff":
        return <JsonDiffConverter />;
      case "Encoding ⇔ Decoding":
        return <EncodeDataConverters />;
      case "Encode Image&File":
        return <DecodeDataConverters />;
      case "ImageToPdf":
        return (
          <GeneralContextProvider>
            <ImageToPdfConverter />
          </GeneralContextProvider>
        );
      case "Merge PDFs":
        return <MergePdfConverter />;
      case "Secure-Pdf":
        return htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : null;
      case "ECC-Tools":
        return <EllipticCurveCryptography />;
      case "Cryptographic Hash":
        return <CryptographicHash />;
      case "BLS Signatures":
        return <BLSSignatures />;
      case "Encryption ⇔ Decryption":
        return <EncryptionDecryption />;
      case "ECDH Key Sharing":
        return <ECDHKeySharing />;
      case "Image Editor":
        return <ImageEditor />;
      case "New App":
        return <ConfigureBasicDetails />;
      case "Requst an app":
        return <RequestAnApp />;
      default:
        return <p>App not found</p>;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* <div className=" p-2 mb-2"> */} 
        <div className="p-2 mb-2 rounded-full shadow-lg bg-slate-100">
        <h1 className="flex text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <em className="flex gap-4 items-center mx-auto">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-7 w-7"
            >
              <path
                fill="#7c3aed"
                d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
              />
            </svg> */}
            <img className="w-10 h-10" src={headingIcon} alt="heading"></img>
            Microcraft
          </em>
        </h1>
      </div>
      <div className="flex justify-between mb-2 md:mb-3">
        <h3 className="py-2 text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          {id}
        </h3>
        <Link to="/" className="py-2">
          <button className="common-button rounded bg-slate-300">
            <img src={crossImage} alt="Go Home" className=" h-8 w-8" />
            <span className="absolute text-hover text-white font-medium mt-2 -ml-6 mx-2 lg:-ml-20  xl:-mx-10 bg-slate-500 p-1 rounded-md z-50">
              Back To Home
            </span>
          </button>
        </Link>
      </div>
      {renderConverterContent()}
    </div>
  );
};

export default Converter;

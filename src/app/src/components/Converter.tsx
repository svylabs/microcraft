import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import crossImage from "./photos/xmark-solid.svg";
import Header from "./Header";
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
      case "New-App":
        return <ConfigureBasicDetails />;
      case "Requst an app":
        return <RequestAnApp />;
      default:
        return <p>App not found</p>;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-2">
      <Header />
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

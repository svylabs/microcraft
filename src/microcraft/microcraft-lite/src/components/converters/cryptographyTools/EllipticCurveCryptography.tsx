import React, { useState } from "react";
import { poseidonHash } from "../../lib/poseidonHash";
import { SHA256, SHA3 } from "crypto-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { secp256k1, schnorr } from "@noble/curves/secp256k1";
import { ed25519 } from "@noble/curves/ed25519";
import { BufferShim } from "buffer-esm";

const curveOptions = ["secp256k1", "ed25519"];
const dsaOptions = ["ECDSA", "Schnorr"];
const hashOptions = ["SHA256", "SHA3", "Poseidon"];

const EllipticCurveCryptography: React.FC = () => {
  const [selectedCurve, setSelectedCurve] = useState("");
  const [selectedDSA, setSelectedDSA] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [hashType, setHashType] = useState("SHA256");
  const [hashedMessage, setHashedMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verificationType, setVerificationType] = useState<
    "signature" | "message"
  >("signature");

  const generateKeys = () => {
    if (!selectedCurve || !selectedDSA) {
      toast.error("Please select curve and DSA.", { position: "bottom-right" });
      return;
    }

    let priv, pub;
    if (selectedDSA === "Schnorr") {
      priv = schnorr.utils.randomPrivateKey();
    } else if (selectedDSA === "ECDSA" && selectedCurve === "secp256k1") {
      priv = secp256k1.utils.randomPrivateKey();
    } else if (selectedDSA === "ECDSA" && selectedCurve === "ed25519") {
      priv = ed25519.utils.randomPrivateKey();
    }

    if (selectedCurve === "secp256k1") {
      pub = secp256k1.getPublicKey(priv);
    } else if (selectedCurve === "ed25519") {
      pub = ed25519.getPublicKey(priv);
    }
    const hexPrivateKey = BufferShim.from(priv, 'hex').toString('hex');
    const hexPublicKey = BufferShim.from(pub, 'hex').toString('hex');

    setPrivateKey(hexPrivateKey);
    setPublicKey(hexPublicKey);
  };

  const signMessage = () => {
    if (!message || !privateKey || !selectedCurve || !selectedDSA) {
      toast.error(
        "Please provide message, private key, and select curve and DSA.",
        { position: "bottom-right" }
      );
      return;
    }

    let hash;
    if (hashType === "SHA256") {
      hash = SHA256(message).toString();
    } else if (hashType === "SHA3") {
      hash = SHA3(message).toString();
    } else if (hashType === "Poseidon") {
      const messageArray = Array.from(message, (char) => char.charCodeAt(0));
      hash = poseidonHash(messageArray);
    }

    setHashedMessage(hash);

    const msg = new TextEncoder().encode(message);

    let sig;
    if (selectedCurve === "secp256k1") {
      if (selectedDSA === "Schnorr" || selectedDSA === "ECDSA") {
        sig = schnorr.sign(msg, privateKey);
      }
    } else if (selectedCurve === "ed25519") {
      if (selectedDSA === "Schnorr") {
        sig = schnorr.sign(msg, privateKey);
      } else if (selectedDSA === "ECDSA") {
        sig = ed25519.sign(msg, privateKey);
      }
    }

    if (sig) {
      const hexSignature  = BufferShim.from(sig, 'hex').toString('hex');
      setSignature(hexSignature);
    }
  };

  const verifySignature = () => {
    if (!message || !signature || !selectedCurve || !selectedDSA) {
      toast.error(
        "Please provide message, signature, and select curve and DSA.",
        { position: "bottom-right" }
      );
      return;
    }

    let hash;
    if (hashType === "SHA256") {
      hash = SHA256(message).toString();
    } else if (hashType === "SHA3") {
      hash = SHA3(message).toString();
    } else if (hashType === "Poseidon") {
      const messageArray = Array.from(message, (char) => char.charCodeAt(0));
      hash = poseidonHash(messageArray).toString();
    }

    let isValid;
    if (selectedCurve === "secp256k1") {
      if (selectedDSA === "Schnorr" || selectedDSA === "ECDSA") {
        const pub = schnorr.getPublicKey(privateKey);
        const msg = new TextEncoder().encode(message);
        const sig = schnorr.sign(msg, privateKey);
        isValid = schnorr.verify(sig, msg, pub);
      }
    } else if (selectedCurve === "ed25519") {
      if (selectedDSA === "Schnorr") {
        const pub = schnorr.getPublicKey(privateKey);
        const msg = new TextEncoder().encode(message);
        const sig = schnorr.sign(msg, privateKey);
        isValid = schnorr.verify(sig, msg, pub);
      } else if (selectedDSA === "ECDSA") {
        const pub = ed25519.getPublicKey(privateKey);
        const msg = new TextEncoder().encode(message);
        const sig = ed25519.sign(msg, privateKey);
        isValid = ed25519.verify(sig, msg, pub);
      }
    }
    toast[isValid ? "success" : "error"](
      isValid ? "Signature is valid" : "Signature is invalid",
      {
        position: "top-center",
      }
    );
  };

  const verifyMessage = () => {
    if (
      !message ||
      !hashedMessage ||
      !signature ||
      !publicKey ||
      !selectedCurve ||
      !selectedDSA
    ) {
      toast.error(
        "Please provide message, hashed message, signature, public key, and select curve and DSA.",
        { position: "bottom-right" }
      );
      return;
    }

    let key;
    try {
      if (selectedCurve === "secp256k1") {
        if (selectedDSA === "Schnorr" || selectedDSA === "ECDSA") {
          key = secp256k1.getPublicKey(privateKey);
        }
      } else if (selectedCurve === "ed25519") {
        key = ed25519.getPublicKey(privateKey);
      }
    } catch (error) {
      toast.error("Invalid public key", { position: "bottom-right" });
      return;
    }

    let hash;
    try {
      if (hashType === "SHA256") {
        hash = SHA256(message).toString();
      } else if (hashType === "SHA3") {
        hash = SHA3(message).toString();
      } else if (hashType === "Poseidon") {
        const messageArray = Array.from(message, (char) => char.charCodeAt(0));
        hash = poseidonHash(messageArray).toString();
      }
    } catch (error) {
      toast.error("Error hashing the message", { position: "bottom-right" });
      return;
    }

    try {
      let isVerified;
      if (selectedCurve === "secp256k1") {
        if (selectedDSA === "Schnorr" || selectedDSA === "ECDSA") {
          const pub = schnorr.getPublicKey(privateKey);
          const msg = new TextEncoder().encode(message);
          const sig = schnorr.sign(msg, privateKey);
          isVerified = schnorr.verify(sig, msg, pub);
        }
      } else if (selectedCurve === "ed25519") {
        if (selectedDSA === "Schnorr") {
          const pub = schnorr.getPublicKey(privateKey);
          const msg = new TextEncoder().encode(message);
          const sig = schnorr.sign(msg, privateKey);
          isVerified = schnorr.verify(sig, msg, pub);
        } else if (selectedDSA === "ECDSA") {
          const pub = ed25519.getPublicKey(privateKey);
          const msg = new TextEncoder().encode(message);
          const sig = ed25519.sign(msg, privateKey);
          isVerified = ed25519.verify(sig, msg, pub);
        }
      }
      
      toast[isVerified ? "success" : "error"](
        isVerified ? "Message is valid" : "Message is invalid",
        {
          position: "top-center",
        }
      );
    } catch (error) {
      toast.error("Error verifying the message", { position: "bottom-right" });
    }
};


  const toggleVerificationType = () => {
    setVerificationType(
      verificationType === "signature" ? "message" : "signature"
    );
  };

  const isVerifyingSignature = verificationType === "signature";

  return (
    <div className="flex flex-col items-center justify-center image-pdf rounded-lg container mx-auto p-4 py-6 md:p-8">
      <div className="w-full max-w-md lg:max-w-xl p-4 md:p-6 bg-slate-50 shadow-lg rounded-md">
        <div className="mb-4">
          <div className="flex justify-between mb-4 text-sm md:text-base">
            <div>
              <select
                className="block w-full md:px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                onChange={(e) => setSelectedCurve(e.target.value)}
              >
                <option value="">Select Curve</option>
                {curveOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="block w-full md:px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                onChange={(e) => setSelectedDSA(e.target.value)}
              >
                <option value="">Select DSA</option>
                {dsaOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="block w-full px-4 py-2 mb-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none"
            onClick={generateKeys}
          >
            Generate Key
          </button>
          <div>
            <label>Private Key:</label>
            <textarea
            className="border bg-white rounded w-full"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            <label>Public Key:</label>
            <textarea
            className="border bg-white rounded w-full"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>Message:</label>
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
            className="border bg-white rounded w-full"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end ">
              <select
                className="block py-2 border border-gray-300 rounded-md focus:outline-none"
                onChange={(e) => setHashType(e.target.value)}
              >
                {hashOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <button
            className="block w-full px-4 py-2 my-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none"
            onClick={signMessage}
          >
            Sign Message
          </button>
        </div>
        <div>
          <label>Hashed Message:</label>
          <textarea
            className="border bg-white rounded w-full"
            value={hashedMessage}
            onChange={(e) => setHashedMessage(e.target.value)}
          />
        </div>
        <div>
          <label>Signature:</label>
          <textarea
            className="border bg-white rounded w-full"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
        <div>
          <button
            className="block w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none"
            onClick={isVerifyingSignature ? verifySignature : verifyMessage}
          >
            {isVerifyingSignature ? "Verify Signature" : "Verify Message"}
          </button>
        </div>
        <div>
          <button
            className="block w-full px-4 py-2 mt-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded-md focus:outline-none"
            onClick={toggleVerificationType}
          >
            Switch to{" "}
            {isVerifyingSignature ? "Verify Message" : "Verify Signature"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EllipticCurveCryptography;

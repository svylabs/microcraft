import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { secp256k1, schnorr } from "@noble/curves/secp256k1";
import { ed25519 } from "@noble/curves/ed25519";
import { x25519 } from "@noble/curves/ed25519";
import { BufferShim } from "buffer-esm";

const curveOptions = ["secp256k1", "ed25519"];

const ECDHKeySharing: React.FC = () => {
  const [selectedCurve, setSelectedCurve] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [otherPublicKey, setOtherPublicKey] = useState("");
  const [sharedKey, setSharedKey] = useState("");

  const generateKeys = async () => {
    if (!selectedCurve) {
      toast.error("Please select curve.", { position: "bottom-right" });
      return;
    }

    let priv, pub;

    if (selectedCurve === "secp256k1") {
      priv = secp256k1.utils.randomPrivateKey();
      pub = secp256k1.getPublicKey(priv);
    } else if (selectedCurve === "ed25519") {
      priv = ed25519.utils.randomPrivateKey();
      pub = ed25519.getPublicKey(priv);
    }

    const hexPrivateKey = BufferShim.from(priv, "hex").toString("hex");
    const hexPublicKey = BufferShim.from(pub, "hex").toString("hex");

    setPrivateKey(hexPrivateKey);
    setPublicKey(hexPublicKey);
  };

  const generateSharedKey = () => {
    if (!selectedCurve || !privateKey || !otherPublicKey) {
      toast.error("Please provide all necessary data.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      let sharedKey;
      if (selectedCurve === "secp256k1") {
        sharedKey = secp256k1.getSharedSecret(privateKey, otherPublicKey);
      } else if (selectedCurve === "ed25519") {
        sharedKey = x25519.getSharedSecret(privateKey, otherPublicKey);
      }

      setSharedKey(BufferShim.from(sharedKey, "hex").toString("hex"));
    } catch (error) {
      console.error("Error generating shared key:", error);
      toast.error("Error generating shared key.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center image-pdf md:text-lg rounded-lg container mx-auto p-4 py-6 md:p-8">
      <div className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl p-4 md:p-6 bg-slate-50 shadow-lg rounded-md">
        <div>
        <label htmlFor="curveSelect">Select Curve:</label>
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

        <button
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 w-full"
         onClick={generateKeys}>Generate Keys</button>

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

        <div>
        <label htmlFor="otherPublicKeyInput">Other Party's Public Key:</label>
        <textarea
          className="border bg-white rounded w-full"
          id="otherPublicKeyInput"
          value={otherPublicKey}
          placeholder="Enter someone party's public key"
          onChange={(e) => setOtherPublicKey(e.target.value)}
        />
        </div>

        <div>
          <button
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 w-full"
           onClick={generateSharedKey}>Generate Shared Key</button>
        </div>

        <div>
        <label>Shared Key:</label>
        <textarea
          className="border bg-white rounded w-full"
          value={sharedKey}
          onChange={(e) => setSharedKey(e.target.value)}
        />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ECDHKeySharing;

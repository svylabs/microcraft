import React, { useState } from "react";
import CryptoJS from "crypto-js";

const EncryptionDecryption: React.FC = () => {
  const [encryptionType, setEncryptionType] = useState<string>("AES-128");
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");

  const generateKey = () => {
    const length = encryptionType === "AES-128" ? 16 : 32; // 128 bits or 256 bits
    const randomKey = CryptoJS.lib.WordArray.random(length);
    setKey(randomKey.toString());
  };

  const handleEncrypt = () => {
    const encryptedData = CryptoJS.AES.encrypt(plainText, key).toString();
    setEncryptedText(encryptedData);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptionType(event.target.value);
    setKey("");
  };

  return (
    <div className="flex flex-col items-center justify-center image-pdf md:text-lg rounded-lg container mx-auto p-4 py-6 md:p-8">
      <div className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl p-4 md:p-6 bg-slate-50 shadow-lg rounded-md">
        <div className="flex items-center">
          <input
            type="radio"
            id="aes128"
            value="AES-128"
            checked={encryptionType === "AES-128"}
            onChange={handleRadioChange}
            className="mr-2"
          />
          <label htmlFor="aes128">AES-128</label>
          <input
            type="radio"
            id="aes256"
            value="AES-256"
            checked={encryptionType === "AES-256"}
            onChange={handleRadioChange}
            className="ml-4 mr-2"
          />
          <label htmlFor="aes256">AES-256</label>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 items-start  justify-between ">
          <input
            type="text"
            value={key}
            placeholder="key"
            readOnly
            className="border border-gray-300 px-3 md:px-4 py-2 rounded w-full"
          />
          <button
            onClick={generateKey}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 md:px-4 py-2 lg:px-0 lg:min-w-32"
          >
            Generate Key
          </button>
        </div>
        <div>
          <label htmlFor="plainText" className="mb-2 block">
            Plain Text
          </label>
          <textarea
            id="plainText"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            placeholder="Enter text ..."
            className="bg-white border border-gray-300 px-3 md:px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="encryptedText" className="mb-2 block">
            Encrypted text
          </label>
          <textarea
            id="encryptedText"
            value={encryptedText}
            placeholder='Output Encrypted text'
            readOnly
            className="bg-white border border-gray-300 px-3 md:px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <button
            onClick={handleEncrypt}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 w-full"
          >
            Encrypt
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncryptionDecryption;

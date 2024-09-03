import React, { useState } from "react";
import CryptoJS from "crypto-js";

const EncryptionDecryption: React.FC = () => {
  const [encryptionType, setEncryptionType] = useState<string>("AES-128");
  const [key, setKey] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

  const generateKey = () => {
    const length = encryptionType === "AES-128" ? 16 : 32; // 128 bits or 256 bits
    const randomKey = CryptoJS.lib.WordArray.random(length);
    setKey(randomKey.toString());
  };

  const handleEncrypt = () => {
    const encryptedData = CryptoJS.AES.encrypt(plainText, key).toString();
    setEncryptedText(encryptedData);
  };

  const handleDecrypt = () => {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
      setDecryptedText(decryptedData);
    } catch (error) {
      console.error("Decryption error:", error);
      setDecryptedText("Error: Unable to decrypt. Please check the key or encrypted text.");
    }
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
            onChange={(e) => setKey(e.target.value)}
            placeholder="key"
            // readOnly
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
            onChange={(e) => setEncryptedText(e.target.value)}
            placeholder="Enter encrypted text ..."
            className="bg-white border border-gray-300 px-3 md:px-4 py-2 rounded w-full"
          />
        </div>
        <div className="flex md:mx-auto">
        <button
            onClick={handleEncrypt}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 w-full md:px-10 lg:px-20"
          >
            Encrypt
          </button>
          </div>
        <div>
          <label htmlFor="decryptedText" className="mb-2 block">
            Decrypted text
          </label>
          <textarea
            id="decryptedText"
            value={decryptedText}
            placeholder="Output Decrypted text"
            readOnly
            className="bg-white border border-gray-300 px-3 md:px-4 py-2 rounded w-full "
          />
        </div>
        <div className="flex md:mx-auto">
        <button
            onClick={handleDecrypt}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-500 w-full md:px-10 lg:px-20"
          >
            Decrypt
          </button>
          </div>
        
        {/* <div className="flex gap-3 justify-between">
          <button
            onClick={handleEncrypt}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 w-full md:w-auto"
          >
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-500 w-full md:w-auto"
          >
            Decrypt
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default EncryptionDecryption;

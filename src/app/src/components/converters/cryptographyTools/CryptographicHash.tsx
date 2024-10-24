import React, { useState } from "react";
import { SHA256, SHA3 } from "crypto-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Poseidon hash function
function poseidonHash(inputVec: number[]): string {
  const securityLevel = 128;
  const inputRate = 3;
  const t = 4;
  const alpha = 5;

  // Define the prime and parameters
  const prime255 = BigInt(
    "57896044618658097711785492504343953926634992332820282019728792003956564819949"
  );
  const parameters = {
    prime255,
    securityLevel,
    alpha,
    inputRate,
    t,
  };

  class Poseidon {
    prime: bigint;
    securityLevel: number;
    alpha: number;
    inputRate: number;
    t: number;

    constructor(
      prime: bigint,
      securityLevel: number,
      alpha: number,
      inputRate: number,
      t: number
    ) {
      this.prime = prime;
      this.securityLevel = securityLevel;
      this.alpha = alpha;
      this.inputRate = inputRate;
      this.t = t;
    }

    runHash(inputVec: number[]): bigint {
      let result = BigInt(0);
      for (let i = 0; i < this.t; i++) {
        result += BigInt(inputVec[i]);
        result = this._poseidonFunction(result);
      }
      return result;
    }

    private _poseidonFunction(input: bigint): bigint {
      return input ** BigInt(this.alpha) % this.prime;
    }
  }

  // Create a new instance of Poseidon and run the hash
  const poseidon = new Poseidon(
    parameters.prime255,
    parameters.securityLevel,
    parameters.alpha,
    parameters.inputRate,
    parameters.t
  );
  const poseidonOutput = poseidon.runHash(inputVec);

  return "0x" + poseidonOutput.toString(16);
}

const CryptographicHash: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("SHA256");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [hashOutput, setHashOutput] = useState<string>("");

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
  };

  const convertToHash = () => {
    if (!inputMessage) {
      toast.error("Please enter a message.", { position: "bottom-right" });
      return;
    }

    let hash;
    if (selectedAlgorithm === "SHA256") {
      hash = SHA256(inputMessage).toString();
    } else if (selectedAlgorithm === "SHA3") {
      hash = SHA3(inputMessage).toString();
    } else if (selectedAlgorithm === "Poseidon") {
      const messageArray = Array.from(inputMessage, (char) =>
        char.charCodeAt(0)
      );
      hash = poseidonHash(messageArray);
    }

    setHashOutput(hash);
  };

  return (
    <div className="flex flex-col items-center justify-center image-pdf rounded-lg container mx-auto p-4 py-6 md:p-8">
      <div className="w-full max-w-md lg:max-w-xl p-4 md:p-6 bg-slate-50 shadow-lg rounded-md">
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            <label>Input Message (Hex):</label>
            <div className="flex md:justify-end text-sm md:text-base lg:mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sha256"
                  name="algorithm"
                  value="SHA256"
                  checked={selectedAlgorithm === "SHA256"}
                  onChange={() => handleAlgorithmChange("SHA256")}
                />
                <label htmlFor="sha256" className="ml-2 mr-4">
                  SHA256
                </label>
                <input
                  type="radio"
                  id="sha3"
                  name="algorithm"
                  value="SHA3"
                  checked={selectedAlgorithm === "SHA3"}
                  onChange={() => handleAlgorithmChange("SHA3")}
                />
                <label htmlFor="sha3" className="ml-2 mr-4">
                  SHA3
                </label>
                <input
                  type="radio"
                  id="poseidon"
                  name="algorithm"
                  value="Poseidon"
                  checked={selectedAlgorithm === "Poseidon"}
                  onChange={() => handleAlgorithmChange("Poseidon")}
                />
                <label htmlFor="poseidon" className="ml-2">
                  Poseidon
                </label>
              </div>
            </div>
          </div>
          <textarea
            className="border bg-white rounded w-full mt-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Hex Input"
          />
        </div>
        <div>
          <label>Hash Output:</label>
          <textarea
            className="border bg-white rounded w-full mt-1"
            value={hashOutput}
            readOnly
            placeholder="Hash value (32 bytes)"
          />
        </div>
        <div className="flex mt-3 md:mt-5">
          <button
            className="block px-4 py-2 mx-auto text-white bg-red-500 rounded-md hover:bg-blue-500 focus:outline-none"
            onClick={convertToHash}
          >
            Convert to Hash
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CryptographicHash;

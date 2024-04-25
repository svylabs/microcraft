import React, { useState, useEffect, useRef } from "react";
import copyClipboard from "../../photos/copy-svgrepo-com.svg";

const EncodingDecoding: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputEncoding, setInputEncoding] = useState("utf-8");
  const [outputEncoding, setOutputEncoding] = useState("hex");
  const [base64UrlSafe, setBase64UrlSafe] = useState(false);
  const [base64NoPadding, setBase64NoPadding] = useState(false);
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inputNumbersRef = useRef<HTMLDivElement>(null);
  const outputNumbersRef = useRef<HTMLDivElement>(null);
  const [inputPopup, setInputPopup] = useState(false);
  const [outputPopup, setOutputPopup] = useState(false);

  const encodeDecode = () => {
    if (inputEncoding === outputEncoding) {
      alert("Input and output encodings cannot be the same.");
      return;
    }
  
    if (!inputText) {
      alert("Input text cannot be empty.");
      return;
    }
  
    if (inputEncoding === "binary") {
      if (outputEncoding === "utf-8") {
        setOutputText(binaryToUtf8(inputText));
      } else if (outputEncoding === "hex") {
        setOutputText(binaryToHex(inputText));
      } else if (outputEncoding === "base64") {
        setOutputText(binaryToBase64(inputText));
      } else if (outputEncoding === "binary") {
        setOutputText(inputText);
      } else {
        alert("Unsupported encoding.");
      }
    } else {
      // Handle other encodings
      let encodedText = "";
      let decodedText = "";
  
      if (inputEncoding === "utf-8") {
        if (outputEncoding === "hex") {
          encodedText = textToHex(inputText);
        } else if (outputEncoding === "base64") {
          let options = "";
          if (base64UrlSafe) options += "u";
          if (base64NoPadding) options += "p";
          encodedText = btoa(inputText);
        } else if (outputEncoding === "binary") {
          encodedText = textToBinary(inputText);
        } else {
          alert("Unsupported encoding.");
          return;
        }
      } else if (inputEncoding === "hex") {
        if (outputEncoding === "utf-8") {
          decodedText = hexToText(inputText);
        } else if (outputEncoding === "base64") {
          decodedText = hexToBase64(inputText);
        } else if (outputEncoding === "binary") {
          decodedText = hexToBinary(inputText);
        } else {
          alert("Unsupported encoding.");
          return;
        }
      } else if (inputEncoding === "base64") {
        if (outputEncoding === "utf-8") {
          decodedText = atob(inputText);
        } else if (outputEncoding === "hex") {
          decodedText = base64ToHex(inputText);
        } else if (outputEncoding === "binary") {
          decodedText = base64ToBinary(inputText);
        } else {
          alert("Unsupported encoding.");
          return;
        }
      }
  
      setOutputText(decodedText || encodedText);
    }
  };
  

  const textToHex = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  };

  const hexToText = (hex: string) => {
    return (
      hex
        .match(/.{1,2}/g)
        ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join("") || ""
    );
  };

  const hexToBase64 = (hex: string) => {
    return btoa(
      String.fromCharCode.apply(
        null,
        hex.match(/\w{2}/g)?.map((hexByte) => parseInt(hexByte, 16)) || []
      )
    );
  };

  const base64ToHex = (str: string) => {
    const bin = atob(str.replace(/[ \r\n]+$/, ""));
    const hex: string[] = [];
    for (let i = 0; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = "0" + tmp;
      hex.push(tmp);
    }
    return hex.join(" ").toUpperCase();
  };

  const textToBinary = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  };

  const binaryToText = (binary: string) => {
    return binary
      .split(" ")
      .map((byte) => String.fromCharCode(parseInt(byte, 2)))
      .join("");
  };

  const hexToBinary = (hex: string) => {
    return hex
      .split(" ")
      .map((hexByte) => parseInt(hexByte, 16).toString(2).padStart(8, "0"))
      .join(" ");
  };

  const binaryToHex = (binary: string) => {
    return binary
      .split(" ")
      .map((byte) => parseInt(byte, 2).toString(16).padStart(2, "0"))
      .join(" ");
  };

  const base64ToBinary = (str: string) => {
    const bin = atob(str.replace(/[ \r\n]+$/, ""));
    return Array.from(bin)
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  };

  const binaryToBase64 = (binary: string) => {
    const bytes = binary
      .split(" ")
      .map((byte) => parseInt(byte, 2))
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return btoa(bytes);
  };

  const binaryToUtf8 = (binary: string) => {
    return decodeURIComponent(
      binary
        .split(" ")
        .map((byte) => `%${parseInt(byte, 2).toString(16).padStart(2, "0")}`)
        .join("")
    );
  };

  useEffect(() => {
    const inputTextarea = inputTextareaRef.current;
    const inputNumbers = inputNumbersRef.current;
    const outputTextarea = outputTextareaRef.current;
    const outputNumbers = outputNumbersRef.current;

    const updateLineNumbers = (
      textarea: HTMLTextAreaElement,
      numbers: HTMLDivElement
    ) => {
      if (textarea && numbers) {
        const lines = textarea.value.split("\n").length;
        numbers.innerHTML = Array.from(
          { length: lines },
          (_, index) => index + 1
        ).join("<br>");
      }
    };

    if (inputTextarea && inputNumbers) {
      updateLineNumbers(inputTextarea, inputNumbers);
      inputTextarea.addEventListener("input", () =>
        updateLineNumbers(inputTextarea, inputNumbers)
      );
    }

    if (outputTextarea && outputNumbers) {
      updateLineNumbers(outputTextarea, outputNumbers);
      outputTextarea.addEventListener("input", () =>
        updateLineNumbers(outputTextarea, outputNumbers)
      );
    }

    return () => {
      if (inputTextarea && inputNumbers) {
        inputTextarea.removeEventListener("input", () =>
          updateLineNumbers(inputTextarea, inputNumbers)
        );
      }
      if (outputTextarea && outputNumbers) {
        outputTextarea.removeEventListener("input", () =>
          updateLineNumbers(outputTextarea, outputNumbers)
        );
      }
    };
  }, []);

  const copyToClipboard = (text: string, type: "input" | "output") => {
    navigator.clipboard.writeText(text);
    if (type === "input") {
      setInputPopup(true);
      setTimeout(() => {
        setInputPopup(false);
      }, 1500);
    } else {
      setOutputPopup(true);
      setTimeout(() => {
        setOutputPopup(false);
      }, 1500);
    }
  };

  return (
    <div className="image-pdf rounded container mx-auto p-4 md:p-8 xl:p-12">
      <div className="max-w-full mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
            Encoding & Decoding
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20">
            <div>
              <h2 className="text-lg font-semibold mb-2">Input Encoding</h2>
              <div className="flex flex-wrap gap-4">
                <div>
                  <input
                    type="radio"
                    id="utf-8"
                    value="utf-8"
                    checked={inputEncoding === "utf-8"}
                    onChange={() => setInputEncoding("utf-8")}
                    className="accent-green-600"
                  />
                  <label htmlFor="utf-8">UTF-8</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="hex"
                    value="hex"
                    checked={inputEncoding === "hex"}
                    onChange={() => setInputEncoding("hex")}
                    className="accent-green-600"
                  />
                  <label htmlFor="hex">Hex</label>
                </div>
                <div className="z-50 sticky top-0">
                  <input
                    type="radio"
                    id="base64"
                    value="base64"
                    checked={inputEncoding === "base64"}
                    onChange={() => setInputEncoding("base64")}
                    className="accent-green-600"
                  />
                  <label htmlFor="base64">Base64</label>
                  {inputEncoding === "base64" && (
                    <div className="ml-4 flex items-center">
                      <input
                        type="checkbox"
                        id="urlSafe"
                        checked={base64UrlSafe}
                        onChange={() => setBase64UrlSafe(!base64UrlSafe)}
                        className="accent-green-600"
                      />
                      <label htmlFor="urlSafe">URL Safe</label>
                      <input
                        type="checkbox"
                        id="noPadding"
                        checked={base64NoPadding}
                        onChange={() => setBase64NoPadding(!base64NoPadding)}
                        className="ml-2 accent-green-600"
                      />
                      <label htmlFor="noPadding">No Padding</label>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="radio"
                    id="binary"
                    value="binary"
                    checked={inputEncoding === "binary"}
                    onChange={() => setInputEncoding("binary")}
                    className="accent-green-600"
                  />
                  <label htmlFor="binary">Binary</label>
                </div>
              </div>
              <div className="flex flex-wrap relative">
                <button
                  onClick={() => copyToClipboard(inputText, "input")}
                  className="absolute right-0 xl:-right-3.5 top-4 hover:bg-blue-600 hover:rounded focus:outline-none"
                >
                  <img
                    src={copyClipboard}
                    alt="copyClipboard"
                    className="p-1"
                  ></img>
                </button>

                {inputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-3 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}

                <label htmlFor="inputText" className="block mt-4 p-1">
                  Input Text
                </label>
              </div>
              <div className="flex bg-gray-900 rounded lg:overflow-auto xl:overflow-visible mt-1 ">
                <div className="px-2 text-gray-500" ref={inputNumbersRef}></div>
                <textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text here..."
                  ref={inputTextareaRef}
                  className="md:w-full lg:min-w-[500px] flex-1 bg-gray-900 text-white outline-none w-full rounded"
                  style={{ overflowY: "hidden" }}
                  rows={5}
                ></textarea>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Output Encoding</h2>
              <div className="flex flex-wrap gap-4">
                <div>
                  <input
                    type="radio"
                    id="utf-8-out"
                    value="utf-8"
                    checked={outputEncoding === "utf-8"}
                    onChange={() => setOutputEncoding("utf-8")}
                    className="accent-green-600"
                  />
                  <label htmlFor="utf-8-out">UTF-8</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="hex-out"
                    value="hex"
                    checked={outputEncoding === "hex"}
                    onChange={() => setOutputEncoding("hex")}
                    className="accent-green-600"
                  />
                  <label htmlFor="hex-out">Hex</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="base64-out"
                    value="base64"
                    checked={outputEncoding === "base64"}
                    onChange={() => setOutputEncoding("base64")}
                    className="accent-green-600"
                  />
                  <label htmlFor="base64-out">Base64</label>
                  {outputEncoding === "base64" && (
                    <div className="ml-4 flex items-center">
                      <input
                        type="checkbox"
                        id="urlSafe-out"
                        checked={base64UrlSafe}
                        onChange={() => setBase64UrlSafe(!base64UrlSafe)}
                        className="accent-green-600"
                      />
                      <label htmlFor="urlSafe-out">URL Safe</label>
                      <input
                        type="checkbox"
                        id="noPadding-out"
                        checked={base64NoPadding}
                        onChange={() => setBase64NoPadding(!base64NoPadding)}
                        className="ml-2 accent-green-600"
                      />
                      <label htmlFor="noPadding-out">No Padding</label>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="radio"
                    id="binary-out"
                    value="binary"
                    checked={outputEncoding === "binary"}
                    onChange={() => setOutputEncoding("binary")}
                    className="accent-green-600"
                  />
                  <label htmlFor="binary-out">Binary</label>
                </div>
              </div>
              <div className="flex flex-wrap relative">
                <button
                  onClick={() => copyToClipboard(outputText, "output")}
                  className="absolute right-0 xl:-right-3.5 top-4 hover:bg-blue-600 hover:rounded focus:outline-none"
                >
                  <img
                    src={copyClipboard}
                    alt="copyClipboard"
                    className="p-1"
                  ></img>
                </button>
                {outputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-3 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}

                <label htmlFor="outputText" className="block mt-4 p-1">
                  Encoded Text
                </label>
              </div>
              <div className="flex bg-gray-900 rounded lg:overflow-auto xl:overflow-visible mt-1">
                <div
                  className="px-2 text-gray-500"
                  ref={outputNumbersRef}
                ></div>
                <textarea
                  placeholder="Output encoded text..."
                  id="outputText"
                  value={outputText}
                  ref={outputTextareaRef}
                  className="md:w-full lg:min-w-[500px] flex-1 bg-gray-900 text-white outline-none w-full rounded"
                  style={{ overflowY: "hidden" }}
                  rows={5}
                  readOnly
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={encodeDecode}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 mx-auto"
            >
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncodingDecoding;

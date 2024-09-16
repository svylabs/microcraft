import React, { useState, useEffect, useRef } from "react";
import copyClipboard from "../../photos/copy-svgrepo-com.svg";
import upload from "../../photos/upload-svgrepo-com.svg";

function EncodeImageFileConverters() {
  const [encodeImages, setEncodeImages] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files?.[0]);
  };

  const handleFileUpload = (file: File | undefined) => {
    if (file) {
      setFileType(file.type);
      setFileSize(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        setEncodeImages(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
    }, 1500);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    const numbers = numbersRef.current;

    const updateLineNumbers = () => {
      if (textarea && numbers) {
        const lines = textarea.value.split("\n").length;
        numbers.innerHTML = Array.from(
          { length: lines },
          (_, index) => index + 1
        ).join("<br>");
      }
    };

    if (textarea) {
      updateLineNumbers();
      textarea.addEventListener("input", updateLineNumbers);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", updateLineNumbers);
      }
    };
  }, []);

  return (
    <div
      className="image-pdf rounded container mx-auto p-4 md:p-8 xl:p-12"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col justify-center items-center mb-4">
        <div className="bg-white rounded-md font-serif py-8 md:p-2 xl:p-4 flex flex-col justify-center items-center">
          <label htmlFor="fileInput" className="cursor-pointer">
            <img
              src={upload}
              alt="upload file"
              className="w-[5rem] bg-blend-multiply filter-none"
            />
          </label>

          <label
            htmlFor="fileInput"
            className="text-xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500 cursor-pointer"
          >
            Upload Files
          </label>
          <p className="lg:text-lg text-black text-center lg:mt-3 p-3">
            Drop your files here or &nbsp;
            <label htmlFor="fileInput" className="text-blue-800 cursor-pointer">
              browse for files
            </label>
          </p>
          <div className="px-10">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      {encodeImages && (
        <>
          {fileType && fileType.startsWith("image/") ? (
            <img
              src={encodeImages}
              alt="image-preview"
              className="h-48 w-48 mb-4 mx-auto rounded-lg shadow-lg"
            />
          ) : (
            <div className="bg-gray-300 rounded-lg p-4 mb-4 text-center">
              <p>File: {fileType}</p>
              <p>Size: {fileSize && (fileSize / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </>
      )}

      <div className="flex items-center relative">
        <button
          onClick={() => copyToClipboard(encodeImages || "")}
          className="absolute right-0 top-1 hover:bg-blue-600 hover:rounded focus:outline-none"
        >
          <img src={copyClipboard} alt="copyClipboard" className="p-1"></img>
        </button>
        {popup && (
          <div className="absolute right-0 lg:-right-4 -top-6 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
            copied!
          </div>
        )}

        <label htmlFor="outputText" className="p-1 text-lg font-bold">
          Base64 encoded
          {fileType && fileType.startsWith("image/") ? " Image" : " File"}
        </label>
      </div>
      <div className="flex bg-gray-900 rounded-md p-2">
        <div
          className="px-2 text-gray-500"
          ref={numbersRef}
          style={{ whiteSpace: "pre-line", overflowY: "hidden" }}
        ></div>
        <textarea
          id="outputText"
          value={encodeImages || ""}
          ref={textareaRef}
          className="md:w-full lg:min-w-[500px] flex-1 bg-gray-900 text-white outline-none overflow-hidden "
          style={{ overflowY: "hidden" }}
          rows={7}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default EncodeImageFileConverters;

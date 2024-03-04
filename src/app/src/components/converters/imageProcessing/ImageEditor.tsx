import React, { useState } from "react";
import ImageCrop from "./crop/ImageCrop";
import ImageCompressor from "./ImageCompressor";

function App() {
  const [activeTab, setActiveTab] = useState("crop");

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white p-2 md:p-8 rounded shadow-md image-pdf mx-auto lg:p-8 xl:p-12">
      <div className="flex flex-col md:flex-row items-center md:justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">
          {activeTab === "crop" ? "Crop Image" : "Compress Image"}
        </h2>
        <div className="">
          <button
            onClick={() => handleTabChange("crop")}
            className={`common-button p-2 md:px-4 md:py-2 font-semibold rounded-md mr-2 focus:outline-none ${
              activeTab === "crop"
                ? "bg-red-500 text-white"
                : "text-blue-500 bg-gray-100 hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            Crop Image
            <span className="absolute text-hover text-white font-medium mt-4 -ml-1 bg-slate-500 p-1 rounded-md z-50">
              Crop mode
            </span>
          </button>
          <button
            onClick={() => handleTabChange("compressor")}
            className={`common-button p-2 md:px-4 md:py-2 font-semibold rounded-md focus:outline-none ${
              activeTab === "compressor"
                ? "bg-red-500 text-white"
                : "text-blue-500 bg-gray-100 hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            Image Compressor
            <span className="absolute text-hover text-white font-medium mt-4 -ml-1 bg-slate-500 p-1 rounded-md z-50">
              Compression mode
            </span>
          </button>
        </div>
      </div>
      {activeTab === "crop" ? <ImageCrop /> : <ImageCompressor />}
    </div>
  );
}

export default App;

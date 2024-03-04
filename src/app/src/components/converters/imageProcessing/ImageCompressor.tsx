import React, { useState } from "react";
import downloadIcon from "../../photos/arrow-down-solid.svg";
import spinIcon from "../../photos/spinner-solid.svg";

const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [desiredSizeMB, setDesiredSizeMB] = useState<number>(1);
  const [uploadedSize, setUploadedSize] = useState<number | null>(null);
  const [compressing, setCompressing] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      displayImageSize(selectedImage);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedImage = e.dataTransfer.files[0];
      setImage(droppedImage);
      displayImageSize(droppedImage);
    }
  };

  const displayImageSize = (file: File) => {
    const fileSizeInKB = file.size / 1024;
    setUploadedSize(fileSizeInKB);
  };

  const handleCompress = () => {
    if (!image) {
      alert("Please upload an image to proceed.")
      return;
    }
    setCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const desiredSizeBytes = desiredSizeMB * 1024 * 1024;
        let quality = 1;
        let compressedDataURL = canvas.toDataURL("image/jpeg", quality);

        while (compressedDataURL.length > desiredSizeBytes && quality > 0) {
          quality -= 0.01;
          compressedDataURL = canvas.toDataURL("image/jpeg", quality);
        }

        setCompressedImage(compressedDataURL);
        setCompressedSize(compressedDataURL.length / 1024);
        setCompressing(false);
      };
    };
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = compressedImage;
    downloadLink.download = "compressed_image.jpg";
    downloadLink.click();

    fetch(compressedImage)
      .then((response) => response.blob())
      .then((blob) => {
        const fileSize = blob.size / 1024;
        console.log(`Downloaded Image Size: ${fileSize.toFixed(2)} KB`);
      })
      .catch((error) => console.error("Error getting image size:", error));
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div>
        {uploadedSize && (
          <p className="">Uploaded Image Size: {uploadedSize.toFixed(2)} KB</p>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex justify-center border-2 border-dashed border-black items-center mt-1 w-[250px] h-[250px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <p>Drag & Drop image here</p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-4 md:mt-0">
        <div className="flex flex-col gap-3 md:text-lg w-full md:w-auto">
          <input className="block w-full text-sm text-slate-50
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100" type="file" accept="image/*" onChange={handleImageChange} />
          <p className="">Desired Compressed Size (MB): {desiredSizeMB}</p>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={desiredSizeMB}
            onChange={(e) => setDesiredSizeMB(Number(e.target.value))}
          />
          {compressing ? (
            <p className="mx-auto">
              <img
                src={spinIcon}
                alt="spin"
                className="animate-spin h-5 w-5 mx-auto"
              ></img>
              Compressing...
            </p>
          ) : (
            <button
              className="p-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500"
              onClick={handleCompress}
            >
              Compress
            </button>
          )}

          {compressedImage && (
            <p className="">Compressed Size: {compressedSize?.toFixed(2)} KB</p>
          )}
          {compressedImage && (
            <div className="mx-auto">
              <button
                className="animate-bounce border rounded-full border-violet-700 p-2 px-3 bg-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-violet-700 focus:ring-opacity-50"
                onClick={handleDownload}
              >
                <img className="w-5" src={downloadIcon} alt="Download" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;

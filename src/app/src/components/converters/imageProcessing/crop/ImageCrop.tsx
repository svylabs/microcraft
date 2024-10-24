import React, { useState, useRef } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import "../ReactCrop.scss";
import "./index.scss";
import rotateLeft from "../../../photos/arrow-rotate-left-solid.svg";
import rotateRight from "../../../photos/arrow-rotate-right-solid.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const defaultAspect = 16 / 9;

export function ImageCrop() {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [imageDimension, setImageDimension] = useState<number | null>(null);
  const [originalImageDimension, setOriginalImageDimension] = useState({
    width: 0,
    height: 0,
  });
  const [croppedImageSize, setCroppedImageSize] = useState<number | null>(null);
  const [desiredFileSizeMB, setDesiredFileSizeMB] = useState<number>(1); // Default to 1 MB
  const [isExpanded, setIsExpanded] = useState(false);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        const image = new Image();
        image.src = reader.result?.toString() || "";
        image.onload = () => {
          setOriginalImageDimension({
            width: image.width,
            height: image.height,
          });
        };
      });
      reader.readAsDataURL(e.target.files[0]);

      // Calculate file size
      const imageDimensionInBytes = e.target.files[0].size;
      setImageDimension(imageDimensionInBytes);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        const canvas = previewCanvasRef.current;
        const dataURL = canvas.toDataURL("image/png");
        const fileSizeInBytes = dataURL.length;
        setCroppedImageSize(fileSizeInBytes);
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
        // setCroppedImageSize({ width: completedCrop.width, height: completedCrop.height });
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(defaultAspect);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        setCrop(centerAspectCrop(width, height, defaultAspect));
      }
    }
  }

  function handleSave() {
    if (previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const dataURL = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "cropped-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function handleReduceSize() {
    if (previewCanvasRef.current && completedCrop) {
      const canvas = previewCanvasRef.current;
      const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Default quality
      const fileSizeInBytes = dataURL.length;
      setCroppedImageSize(fileSizeInBytes);
      alert("Image compression successful!");
    }
  }

  function handleDesiredFileSizeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newSizeMB = parseFloat(event.target.value);
    setDesiredFileSizeMB(newSizeMB);
  }

  function handleReduceSizeAndDownload() {
    if (previewCanvasRef.current && completedCrop) {
      const canvas = previewCanvasRef.current;

      // Calculate the desired file size in bytes
      const desiredFileSizeBytes = desiredFileSizeMB * 1024 * 1024 * 2.1;

      // Calculate the quality factor to achieve the desired file size
      const currentDataURL = canvas.toDataURL("image/jpeg", 1); // Get the current data URL with the maximum quality
      const currentFileSizeBytes = currentDataURL.length;
      let quality = 1;
      if (currentFileSizeBytes > desiredFileSizeBytes) {
        quality = desiredFileSizeBytes / currentFileSizeBytes;
      }

      // Generate the blob with adjusted quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = window.URL.createObjectURL(blob);

            // Create a downloadable link for the reduced image
            const a = document.createElement("a");
            a.href = url;
            a.download = "reduced-image.jpg";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        },
        "image/jpeg",
        quality
      );
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="md:text-lg flex flex-col gap-3">
      <div className="Crop-Controls flex flex-col lg:flex-row gap-4 lg:justify-between">
        <div className="">
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 w-full text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out 
            file:mr-4 file:py-2 file:px-1 md:file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-col lg:flex-row lg:gap-1 lg:text-xl lg:items-center">
            <label htmlFor="scale-input">Scale: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full lg:w-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-1 lg:text-xl lg:items-center">
            <label htmlFor="rotate-input">Rotate: </label>
            <input
              id="rotate-input"
              type="number"
              value={rotate}
              disabled={!imgSrc}
              onChange={(e) =>
                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
              }
              className="w-full lg:w-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-1 lg:text-xl lg:items-center">
            <label>Toggle aspect: </label>
            <button
              onClick={handleToggleAspectClick}
              className={`px-4 py-2 rounded-md lg:w-24 hover:bg-${aspect ? "red" : "green"}-500 transition duration-300 bg-${aspect ? "red" : "green"}-500 text-white`}
            >
              {aspect ? "OFF" : "ON"}
            </button>
          </div>
        </div>
      </div>
      {!!imgSrc && (
        <div className="flex flex-col lg:flex-row justify-between mt-2 lg:gap-5">
          <div className="w-full">
            <div>
              Dimensions: {originalImageDimension.width} x{" "}
              {originalImageDimension.height} | Image Size:{" "}
              {imageDimension
                ? (imageDimension / (1024 * 1024)).toFixed(2)
                : "Calculating..."}{" "}
              MB
            </div>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={400}
              minHeight={200}
              circularCrop
              ruleOfThirds
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                className="w-full h-auto"
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          <div className="w-full flex flex-col gap-4 items-center lg:justify-center">
            <div className="flex gap-5 w-full justify-center lg:justify-around">
              <button
                onClick={() => setRotate(rotate - 90)}
                disabled={!imgSrc}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                <img className="h-8 w-8" src={rotateLeft} alt="Rotate Left" />
              </button>
              <button
                onClick={() => setRotate(rotate + 90)}
                disabled={!imgSrc}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                <img className="h-8 w-8" src={rotateRight} alt="Rotate Right" />
              </button>
            </div>
            <div className="">
              {!!completedCrop && (
                <div>
                  Dimensions: {completedCrop.width.toFixed(2)} x{" "}
                  {completedCrop.height.toFixed(2)} | <br></br> Cropped Image
                  Size:{" "}
                  {croppedImageSize
                    ? (croppedImageSize / (1024 * 1024)).toFixed(2)
                    : "Calculating..."}{" "}
                  MB
                </div>
              )}
              {!!completedCrop && (
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                  className="mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <button
          onClick={handleSave}
          disabled={!completedCrop}
          className={`common-button bg-green-500 text-white px-4 py-2 mx-auto w-full lg:w-auto rounded-md ${!completedCrop && "opacity-50 cursor-not-allowed"} hover:bg-green-600 transition duration-300`}
        >
          Save Cropped Image
          {!completedCrop && 
          <span className="absolute text-hover text-white font-medium mt-4 -ml-10 md:ml-32 lg:-ml-28 bg-slate-500 p-1 rounded-md z-50">
          Please choose an image before proceeding.
        </span>}
        </button>
      </div>
      <div className=" flex flex-col gap-3">
        <button
          className="flex gap-3 items-center text-lg font-semibold mb-2 cursor-pointer"
          onClick={toggleExpand}
        >
          <span>Optimize Cropped Image Compression</span>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
          />
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-2">
            <label htmlFor="desired-file-size">Desired Image Size (MB): </label>
            <div className="flex gap-3 ">
              <input
                id="desired-file-size"
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={desiredFileSizeMB}
                onChange={handleDesiredFileSizeChange}
                className="w-3/4 lg:w-2/4"
              />
              <span className="text-center">{desiredFileSizeMB} MB</span>
            </div>
          </div>
        )}
        {isExpanded && (
          <>
            <div>
              <button
                onClick={handleReduceSize}
                disabled={!completedCrop}
                className={`bg-yellow-500 text-white px-4 py-2 rounded-md ${!completedCrop && "opacity-50 cursor-not-allowed"} hover:bg-yellow-600 transition duration-300`}
              >
                Compress Cropped Image
              </button>
            </div>
            <div>
              <button
                onClick={handleReduceSizeAndDownload}
                disabled={!completedCrop}
                className={`bg-orange-500 text-white px-4 py-2 rounded-md ${!completedCrop && "opacity-50 cursor-not-allowed"} hover:bg-orange-600 transition duration-300`}
              >
                Download Optimized Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCrop;

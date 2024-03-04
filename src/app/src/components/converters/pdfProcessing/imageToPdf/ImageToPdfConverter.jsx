import { useContext } from "react";
import { GeneralContext } from "./GeneralContextProvider";
import utils from "./utils";
import Popup from "./Popup";
import Carousel from "./Carousel";
import "./ImageToPdfConverter.css"

const Utils = new utils();

const ImageToPdfConverter = () => {
  const { files, setFiles, popup, setPopup } = useContext(GeneralContext);

  const handleFile = (e) => {
    let filesArray = [...files];

    [...e.target.files].forEach((file) => {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        filesArray.push(file);
      }
    });

    if (filesArray.length <= 20) {
      setFiles(filesArray);
    } else {
      setPopup({ show: true, message: "Exceeded limit of 20 images.", timeout: 5 });
    }
  };

  const clearQueue = () => {
    if (files.length > 0) {
      setFiles(() => []);
      setPopup({ show: true, message: "Queue cleared.", timeout: 5 });
    }
  };

  const download = () => {
    if (files.length > 0) {
      setPopup({ show: true, message: "Converting images to PDF...", timeout: 60 });
      Utils.generatePDF(files).then(() => setPopup({ show: true, message: "Download completed!", timeout: 5 }));
    } else {
      setPopup({ show: true, message: "Please upload images!", timeout: 5 });
    }
  };

  return (
    <div className="image-pdf rounded-lg container mx-auto p-4">
      {popup.show ? <Popup /> : ""}
      <div className="container mx-auto p-4">
        <div className="box">
          <div className="wrapper flex flex-col items-center">
            <span className="text text-5xl">+</span>
            <p className="prompt text-white text-sm text-center">Click or drag and drop files here to upload</p>
            <input
              id="file-upload"
              type={"file"}
              multiple
              accept={"image/png, image/jpeg"}
              onChange={handleFile}
              className="hidden"
            />
          </div>
        </div>
        <Carousel files={files} />
        <div className="button_container mt-4 flex justify-center">
          <button className="action clear_queue mr-2" onClick={clearQueue}>
            Clear queue
          </button>
          <button className="action download" onClick={download}>
            Download [PDF]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageToPdfConverter;

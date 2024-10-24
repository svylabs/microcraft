import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import { Button } from "@mantine/core";
import { FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import upload from "../../../photos/upload-svgrepo-com.svg";

const MergePdfConverter = () => {
  const [pdfs, setPdfs] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const loadedPdfs = await Promise.all(
      acceptedFiles.map(async (file) => {
        if (file.type === "application/pdf") {
          const data = await file.arrayBuffer();
          return { data, name: file.name };
        } else {
          alert("Please upload only PDF files.", "Error");
          return null;
        }
      })
    );

    const validPdfs = loadedPdfs.filter((pdf) => pdf !== null);
    setPdfs((prevPdfs) => [...prevPdfs, ...validPdfs]);
  };

  const handleMergePdf = async () => {
    try {
      const mergedDoc = await mergePDFs(pdfs);
      const mergedPdfBytes = await mergedDoc.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      setMergedPdf(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
  };

  const handleRemovePdf = (index) => {
    const removedPdf = pdfs[index];
    setPdfs((prevPdfs) => prevPdfs.filter((_, i) => i !== index));

    setTimeout(() => {
      toast.success(`${removedPdf.name} removed!`, {
        position: "bottom-right",
      });
    }, 0);
  };

  const mergePDFs = async (pdfs) => {
    const mergedDoc = await PDFDocument.create();

    for (const pdf of pdfs) {
      const loadedPdf = await PDFDocument.load(pdf.data);
      const copiedPages = await mergedDoc.copyPages(
        loadedPdf,
        loadedPdf.getPageIndices()
      );
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    }

    return mergedDoc;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="image-pdf rounded-lg container mx-auto p-4">
      <div className="container mx-auto p-2">
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="bg-white rounded-md font-serif p-4 flex flex-col justify-center items-center md:w-full max-w-md lg:max-w-xl md:h-80">
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
            <div
              {...getRootProps()}
              style={dropzoneStyle}
              className="mb-4 md:p-2 text-center"
            >
              <input
                {...getInputProps()}
                type="file"
                id="fileInput"
                className="hidden"
              />
              {isDragActive ? (
                <p>Drop PDFs here...</p>
              ) : (
                <p className="lg:text-lg text-black text-center p-3">
                  Drop your files here or &nbsp;
                  <label className="text-blue-800 cursor-pointer">
                    browse for files
                  </label>
                </p>
              )}
            </div>
          </div>
        </div>
        {pdfs.length > 0 && (
          <div className="mb-4 border p-4 max-h-48 overflow-y-auto rounded-md overflow-hidden shadow-md">
            <div className="bg-gray-800 text-white py-2 px-4">
              <h2 className="text-2xl">Added PDFs:</h2>
            </div>
            <ul className="divide-y divide-gray-300">
              {pdfs.map((pdf, index) => (
                <li key={index} className="flex items-center py-2 px-4">
                  <span className="flex-grow text-xl truncate w-10 overflow-auto">
                    {pdf.name}
                  </span>
                  <FiX
                    className="cursor-pointer bg-red-500 rounded-full text-white text-lg hover:bg-red-600 transition-all duration-300"
                    onClick={() => handleRemovePdf(index)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {pdfs.length === 0 && (
          <p className="text-center text-xl">No PDFs uploaded</p>
        )}
        <div className="button_container mt-4 flex flex-col md:flex-row justify-center">
          <Button
            className="bg-red-500 text-white rounded p-2 px-4"
            onClick={handleMergePdf}
          >
            Merge PDFs
          </Button>
          {mergedPdf && pdfs.length > 0 && (
            <div>
              <a
                href={mergedPdf}
                download="merged.pdf"
                className="bg-slate-700 rounded p-2 px-4 text-white"
              >
                Download Merged PDF
              </a>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const dropzoneStyle = {
  width: "220px",
  height: "100px",
  border: "2px dashed #ccc",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "20px auto",
  cursor: "pointer",
};

export default MergePdfConverter;

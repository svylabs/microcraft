import React, { useState, useEffect } from "react";
import "./ConfigureBasicDetails.scss";
import { toast } from "react-toastify";
import arrow from "../../photos/angle-right-solid.svg";
import { Link } from "react-router-dom";
import { GITHUB_CLIENT_ID, BASE_API_URL } from "~/components/constants";

const ConfigureBasicDetails: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    privacy: false,
  });
  const [userDetails, setUserDetails] = useState<string | null>(null);

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    console.log(userDetails);
    setUserDetails(userDetails);
    const existingData = localStorage.getItem("formData");
    if (existingData) {
      const formData = JSON.parse(existingData);
      setTitle(formData.title || "");
      setDescription(formData.description || "");
    }
  }, []);

  const handleSaveNext = () => {
    if (!title.trim()) {
      setFieldErrors({ ...fieldErrors, title: !title.trim() });
      return;
    } else {
      localStorage.removeItem("formData");
      const data = { title, description };
      localStorage.setItem("formData", JSON.stringify(data));
      window.location.href = "/app/new/contract";
    }
  };

  // Allow users to build apps via CLI and import them into the UI for preview and editing of components.
  // Helper to save data to local storage
  const saveDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Function to handle file upload and parse JSON
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]; //optional chaining
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        try {
          const jsonData = JSON.parse(e.target.result);
          const { name, description, components, contracts, network } = jsonData;

          // Get existing formData from localStorage
          const existingFormData = localStorage.getItem("formData");
          const existingData = existingFormData ? JSON.parse(existingFormData) : {};

          // Set title, description, contracts, and network details in formData
          const updatedFormData = {
            ...existingData,
            title: name,
            description: description,
            contractDetails: contracts,
            networkDetails: network,
          };

          // Update local storage with the new formData
          saveDataToLocalStorage("formData", updatedFormData);

          // Save components in localStorage
          saveDataToLocalStorage("components", components);

          setFileUploaded(true); // Update state to indicate successful upload
          toast.success("JSON file uploaded successfully!");

          // // Redirect to preview page after uploading
          // window.location.href = "/app/new/field";

        } catch (error) {
          console.error("Error parsing JSON file:", error);
          toast.error("Invalid JSON file format.");
        }
      } else {
        toast.error("Failed to read file.");
      }
    };
    reader.readAsText(file);
  };

  const handlePreview = () => {
    if (!fileUploaded) {
      toast.error("Please upload a JSON file before previewing.");
    } else {
      window.location.href = "/app/new/field";
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 md:p-10 xl:p-12 shadow-lg rounded-md">
      <div className="p-1 md:p-4 flex flex-col gap-5 bg-gray-100 rounded">
        {userDetails != null ? (
          <div className="p-1 md:p-4 flex flex-col gap-5">
            <div className="relative flex overflow-auto gap-8 lg:gap-5 xl:gap-2 border-b pb-5 items-center">
              <p className="flex gap-3 items-center text-[#414A53] ">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[7rem] lg:w-[10rem] xl:w-[14rem] bg-[#31A05D]"></span>
              </p>
              <p className="flex gap-3 items-center text-[#414A53] ">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                  2
                </span>
                Configure Visibility
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              </p>
              <p className="flex gap-3 items-center text-[#414A53] ">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                  3
                </span>
                Configure layout
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              </p>
              <p className="flex gap-3 items-center text-[#414A53] ">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                  4
                </span>
                Preview the app
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              </p>
              <p className="flex gap-3 items-center text-[#414A53] ">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                  5
                </span>
                Publish the app
              </p>
            </div>
            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 lg:gap-8">
              {/* Import Section */}
              <div className="flex flex-col gap-4 bg-white p-2 md:p-3 lg:p-6 rounded-lg shadow-lg">
                {/* <h3 className="text-center text-xl lg:text-2xl font-bold text-[#414A53]">Import</h3> */}
                <h3 className="text-center text-xl lg:text-2xl font-bold text-[#414A53]">Import App Details</h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="fileUpload" className="text-[#727679] font-semibold text-lg xl:text-xl">Upload JSON File</label>
                  <input
                    type="file"
                    id="fileUpload"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="border border-gray-300 rounded-lg p-2 bg-[#eaeaec] hover:bg-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-end">
                  <Link to="#" onClick={handlePreview} className="mx-0">
                    <button
                      className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                    >
                      Preview
                    </button>
                  </Link>
                </div>
              </div>
              {/* Configure Manually Section */}
              <div className="flex flex-col gap-4 bg-white p-2 md:p-3 lg:p-6 rounded-lg shadow-lg">
                {/* <h3 className="text-center text-xl lg:text-2xl font-bold text-[#414A53]">Configure Manually</h3> */}
                <h3 className="text-center text-xl lg:text-2xl font-bold text-[#414A53]">Set Up App Details</h3>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="text-[#727679] font-semibold text-lg xl:text-xl"
                  >
                    Title (Limit: 32 characters)
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    className="focus:outline-none border border-[#E2E3E8] rounded-lg p-3 px-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] placeholder:italic"
                    placeholder="Enter app title.."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                  {fieldErrors.title && (
                    <p className="text-red-500 mt-2">Title is required.</p>
                  )}
                  <br></br>

                  <label
                    htmlFor="description"
                    className="text-[#727679] font-semibold text-lg xl:text-xl"
                  >
                    Description
                  </label>
                  <textarea
                    className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] resize-none placeholder:italic"
                    placeholder="Enter app description.."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Link to="#" onClick={handleSaveNext} className="mx-0">
                    <button
                      className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                      type="submit"
                    >
                      Save & Next
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5">
            <p className="text-[#727679] mb-4">
              You need to log in to create custom apps.
            </p>
            <a
              href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`}
              className="mx-auto md:mx-0"
            >
              <button
                className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                type="submit"
              >
                Login with GitHub
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureBasicDetails;
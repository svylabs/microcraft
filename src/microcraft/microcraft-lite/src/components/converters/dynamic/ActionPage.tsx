import React, { useEffect, useState } from "react";
import "./ActionPage.scss";
import { toast, ToastContainer } from "react-toastify";
import { BASE_API_URL } from "~/components/constants";
import { Link } from "react-router-dom";
import arrow from "../../photos/angle-right-solid.svg";
import Table from "./outputPlacement/TableComponent";
import Loading from "./loadingPage/Loading";
import App from "./Renderer/App";
// import DynamicApp from 'microcraft-lib';

interface Output {
  [key: string]: any;
}

const ActionPage: React.FC = () => {
  const [outputCode, setOutputCode] = useState<Output | string>();
  const [outputFormat, setOutputFormat] = useState<string>("json");
  const [graphType, setGraphType] = useState<string>("bar");
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);

  const savedFormDataString = localStorage.getItem("formData");
  const savedFormData = savedFormDataString
    ? JSON.parse(savedFormDataString)
    : {};
  const savedComponents = localStorage.getItem("components");
  const savedComponentsData = savedComponents
    ? JSON.parse(savedComponents)
    : [];
  const [loadedData, setLoadedData] = useState(savedFormData);
  const [components, setComponents] = useState(savedComponentsData);
  // console.log(components);
  // console.log("loadedData-> ", loadedData);

  const setSelectedApp = (appId: string) => {
    fetch(`${BASE_API_URL}/appdata/set-selected-app`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ selected_app: appId }),
    }).then((response) => {
      if (response.ok) {
        console.log("App selected successfully");
      } else {
        if (toast) {
          toast.error(
            "Error initializing the app - some features of the app may not function properly. Please refresh the page and try again."
          );
        }
      }
    });
  };

  useEffect(() => {
    setLoadedData(savedFormData);
    setComponents(savedComponentsData);
    setSelectedApp("sandbox-" + savedFormData.title);

    // Initialize dropdowns with their first options
    const initialDropdownState = {};
    components.forEach((component) => {
      if (component.type === "dropdown") {
        initialDropdownState[component.id] =
          component.config.optionsConfig
            .values[0].trim();
      }
      if (component.type === "slider") {
        setData((prevData) => ({
          ...prevData,
          [component.id]: component.config.sliderConfig.value,
        }));
      }
    });
    setData((prevData) => ({
      ...prevData,
      ...initialDropdownState,
    }));
  }, []);

  const goThumbnail = () => {
    // setLoading(true);
    window.location.href = "/app/new/thumbnail";
  };

  const goBack = () => {
    // setLoading(true);
    window.location.href = "/app/new/field";
  };

  // console.log(data);
  return (
    <>
      {/* <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12 pb-6 md:pt-1 lg:pt-0 xl:pt-6"> */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12">
        {/* <ToastContainer /> */}
        <div className="p-2 md:p-4 bg-gray-100 rounded">
          <div className="relative flex overflow-auto gap-5 md:gap-8 lg:gap-5 xl:gap-2 border-b pb-5 items-center mb-2">
            <Link to="/app/inbuilt/New-App" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] lg:w-[9rem] xl:w-[12.5rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/contract" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                  2
                </span>
                Configure Visibility
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[11rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/field" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                  3
                </span>
                Configure layout
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[10.5rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                4
              </span>
              Preview the app
              <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[10.5rem] bg-[#31A05D]"></span>
            </p>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                5
              </span>
              Publish the app
            </p>
          </div>
          <div className="flex justify-between my-4">
            <h1 className="md:text-2xl font-bold">
              Showing preview of {loadedData.title} App
            </h1>
            <button
              className="common-button px-4 py-2 text-white font-semibold bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none hover:bg-blue-600 hover:shadow-lg transition duration-300"
              onClick={goBack}
            >
              <span className="absolute text-hover text-white font-medium mt-10 -ml-16 mr-10 lg:-ml-20 px-2 bg-slate-500 p-1 rounded-md z-50">
                Return to inputs/outputs
              </span>
              Back
            </button>
          </div>

          {/* <App
            components={components}
            data={data}
            setData={setData}
            debug={setOutputCode}
            contractMetaData={loadedData}
          /> */}

          <App
            components={components}
            data={data}
            setData={setData}
            contracts={loadedData.contractDetails}
            network={loadedData.networkDetails}
            debug={setOutputCode}
          />


          {/* <DynamicApp
            components={components}
            data={data}
            setData={setData}
            debug={setOutputCode}
            contractMetaData={loadedData}
          /> */}

          <div className="flex justify-end">
            <button
              className="p-3 px-5 font-bold text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700"
              onClick={goThumbnail}
            >
              Add Thumbnail
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold">Execution log:</h2>
            {
              outputFormat === "json" ? (
                <pre className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
                  {outputCode
                    ? JSON.stringify(outputCode, null, 2)
                    : "Execution log not available yet"}
                </pre>
              ) : outputFormat === "table" ? (
                <Table data={outputCode} />
              ) : (
                <div></div>
              )
              // : null
            }
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default ActionPage;

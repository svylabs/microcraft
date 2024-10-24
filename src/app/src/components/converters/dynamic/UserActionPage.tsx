import React, { useEffect, useState, useRef } from "react";
import "./ActionPage.scss";
import { redirect, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_API_URL } from "~/components/constants";
import Loading from "./loadingPage/Loading";
// import App from "./Renderer/App";
import DynamicApp from '@svylabs/microcraft-lib';

interface Output {
  [key: string]: any;
}

interface LoadedData {
  contract_details: any[];
  network_details: any;
}

const UserActionPage = () => {
  const location = useLocation();
  const { appId } = useParams<{ appId: string; title?: string }>();
  // const { appId } = useParams<{ appId: string }>();
  const [output, setOutput] = useState<any>(location?.state?.output || {});
  const queryParams = new URLSearchParams(location.search);
  const [components, setComponents] = useState(
    output?.component_definition || []
  );
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [outputCode, setOutputCode] = useState<Output | string>();
  const [buttons, setButtons] = useState({});
  const [initialTrigger, setInitialTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [feedback, setFeedback] = useState(false);
  const [loadedData, setLoadedData] = useState<LoadedData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_API_URL}/dynamic-component/${appId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLoadedData(data);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    if (appId) {
      fetchData();
    }
  }, [appId]);


  const isAuthenticated = () => {
    if (localStorage.getItem("userDetails")) {
      return true;
    }
    return false;
  };

  const setSelectedApp = (appId: string | undefined) => {
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
    if (components.length === 0) {
      fetch(`${BASE_API_URL}/dynamic-component/${appId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Component detail: ", data);
          const component_def =
            typeof data.component_definition === "string"
              ? JSON.parse(data.component_definition)
              : data.component_definition;
          setComponents(component_def || []);
          setOutput(data);
          if (data.is_authentication_required) {
            if (isAuthenticated()) {
              setSelectedApp(appId);
            } else {
              toast.error(
                "Some features of this app may work only if you are logged into the platform."
              );
            }
          }

          const initialDropdownState = {};

          component_def.forEach((component) => {
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
        });
    }
  }, []);

  useEffect(() => {
    const prevButtons = { ...buttons };
    queryParams.forEach((value, key) => {
      if (
        components.find(
          (component) => component.id === key && component.type === "button"
        )
      ) {
        console.log("Setting button state: ", key, true);
        prevButtons[key] = true;
        // Do nothing
        //refMap[key].current.click();
      } else {
        setData((prevData) => ({
          ...prevData,
          [key]: value,
        }));
      }
    });
    console.log("Setting buttons: ", prevButtons);
    setButtons(prevButtons);
    if (initialTrigger == false) {
      setInitialTrigger(true);
    }
  }, [output, components]);

  useEffect(() => {
    console.log("Initial Trigger: ", initialTrigger);
    if (initialTrigger) {
      console.log(buttons);
      components.forEach((component) => {
        if (component.type === "button" && buttons[component.id]) {
          console.log("Button Clicked: ", component.id);
          document.getElementById(component.id)?.click();
        }
      });
    }
  }, [buttons]);

  const goBack = () => {
    // setFeedback(true);
    window.location.href = "/";
  };

  // function submitFeedback() {
  //   setFeedback(false);
  //   window.location.href = "/";
  // }

  return (
    <>
      <div className="image-pdf px-4 min-h-[88vh] flex flex-col pb-10">
        {/* <ToastContainer /> */}
        <h1 className="text-xl md:text-3xl font-bold py-2 mx-auto bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
          {output.title || appId}
        </h1>
        <div className=" bg-gray-100 shadow-lg rounded-md flex flex-col gap-5 p-2 pt-3 md:p-3 lg:pt-8 lg:p-6 lg:mx-20 xl:mx-40">
          {(output.approval_status || "pending") === "pending" && (
            <div className="bg-yellow-200 text-yellow-800 p-2 rounded-md md:text-sm flex justify-center items-center animate-pulse">
              <p>
                <span className="font-bold text-lg mr-2">⚠️ Caution:</span>
                This tool is currently under review. Proceed with caution.
              </p>
            </div>
          )}
          <div className="px-2 md:p- text-wrap">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h1 className="font-semibold md:text-xl hidden md:block">
                {output.title || appId}
              </h1>
              <button
                className="common-button px-4 py-2 text-white font-semibold bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none hover:bg-blue-600 hover:shadow-lg transition duration-300 self-end md:self-auto"
                onClick={goBack}
              >
                <span className="absolute text-hover text-white font-medium mt-10 -ml-14 px-2 md:-ml-11 bg-slate-500 p-1 rounded-md z-50">
                  Back To Home
                </span>
                Back
              </button>
              <h1 className="block md:hidden font-semibold text-lg mt-2">
                {output.title || appId}
              </h1>
            </div>

            {/* <App
            components={components}
            data={data}
            setData={setData}
            contracts={loadedData?.contract_details || []}
            network={loadedData?.network_details || {}}
            debug={setOutputCode}
          /> */}

          <DynamicApp
            components={components}
            data={data}
            setData={setData}
            contracts={loadedData?.contract_details || []}
            network={loadedData?.network_details || {}}
            debug={setOutputCode}
          />
          </div>

          {/* {feedback && (
            // <div className="flex flex-col justify-center items-center -ml-[1rem] md:-ml-[2.5rem] lg:-ml-[6.5rem] xl:-ml-[11.5rem] fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
            <div className="flex flex-col justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-md font-serif p-1 py-8 md:p-2 xl:p-4 flex flex-col justify-center items-center w-[20rem] md:w-[25rem] md:h-[20rem] lg:w-[30rem] lg:p-6 xl:w-[36rem] gap-3">
                <h2 className="text-xl md:text-2xl xl:text-3xl text-[#589c36] text-center">
                  What is your level of satisfaction with this tool app?
                </h2>
                <p className="text-[#85909B] xl:text-xl text-center">
                  This will help us improve your experience.
                </p>
                <label className="flex gap-5 md:mt-1 text-4xl md:text-5xl lg:text-6xl lg:gap-6 text-[#85909B] mx-5 xl:mx-10">
                  <button onClick={submitFeedback}>
                    &#128545;
                    <span className="text-lg md:text-xl xl:text-2xl text-red-600">
                      Unhappy
                    </span>
                  </button>
                  <button onClick={submitFeedback}>
                    &#128528;
                    <span className="text-lg md:text-xl xl:text-2xl text-yellow-500">
                      Neutral
                    </span>
                  </button>
                  <button onClick={submitFeedback}>
                    &#128525;
                    <span className="text-lg md:text-xl xl:text-2xl text-green-600">
                      Satisfied
                    </span>
                  </button>
                </label>
              </div>
            </div>
          )} */}
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default UserActionPage;

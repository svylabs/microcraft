import React, { useEffect, useState } from "react";
import "./ActionPage.scss";
import { redirect, useLocation } from "react-router-dom";

interface Output {
  [key: string]: any;
}

const UserActionPage = () => {
  const location = useLocation();
  const output = location.state && location.state.output;
  const [components, setComponents] = useState(output.component_definition);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [outputCode, setOutputCode] = useState<Output | string>();
  const [outputFormat, setOutputFormat] = useState<string>("json");
  // const [feedback, setFeedback] = useState(false);

  const savedFormDataString = localStorage.getItem("formData");
  const savedFormData = savedFormDataString
    ? JSON.parse(savedFormDataString)
    : [];
  const [loadedData, setLoadedData] = useState(savedFormData);

  useEffect(() => {
    setLoadedData(savedFormData);
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handleRun = async (
    code: string,
    inputValues: { [key: string]: string }
  ) => {
    try {
      const result = await eval(code);
      console.log(result);
      setOutputCode(result);
    } catch (error) {
      console.log(`Error: ${error}`);
      setOutputCode(`Error: ${error}`);
    }
  };

  const formatOutput = (data: any) => {
    if (data === null || data === undefined) {
      console.error("Error: Data is null or undefined");
      return "Error: Data is null or undefined";
    }

    if (typeof data === "object") {
      if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === "object") {
          const tableHeaders = Object.keys(data[0]);
          return (
            <table>
              <thead>
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    {tableHeaders.map((header) => (
                      <td key={header}>{formatOutput(item[header])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      } else {
        return (
          <table>
            <tbody>
              {Object.entries(data).map(([key, value]: [string, any]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{formatOutput(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    }
    return data;
  };

  const goBack = () => {
    // setFeedback(true);
    redirect("/");
  };

  // function submitFeedback() {
  //   setFeedback(false);
  //   window.location.href = "/";
  // }

  return (
    <div className=" bg-gray-100 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:mt-8 lg:p-6 lg:mx-20 xl:mt-16 xl:mx-40">
      {output.approval_status === "pending" && (
        <div className="bg-yellow-200 text-yellow-800 p-2 rounded-md md:text-sm flex justify-center items-center animate-pulse">
          <p>
            <span className="font-bold text-lg mr-2">⚠️ Caution:</span>
            This tool is currently under review. Proceed with caution.
          </p>
        </div>
      )}
      <div className="p-2 md:p-4 ">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold">{output.title}:</h1>
          <button
            className="common-button px-4 py-2 text-white font-semibold bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none hover:bg-blue-600 hover:shadow-lg transition duration-300"
            onClick={() => goBack()}
          >
            <span className="absolute text-hover text-white font-medium mt-10 -ml-14 px-2 md:-ml-11 bg-slate-500 p-1 rounded-md z-50">
              Back To Home
            </span>
            Back
          </button>
        </div>
        <ul className="">
          {components.map((component, index) => (
            <li key={index} className="mb-4">
              ID: {component.id}, Label: {component.label}, Type:{" "}
              {component.type}, Placement: {component.placement}
              {component.code && `, Code: ${component.code}`}
              <br />
              {component.type !== "button" && (
                <div>
                  <label className="text-slate-500 font-semibold text-lg xl:text-xl">
                    {component.label}:
                  </label>
                  <input
                    className="w-full px-4  p-2 mt-1 border bg-slate-200 border-gray-300 rounded focus:outline-none"
                    type={component.type}
                    id={component.id}
                    value={inputValues[component.id] || ""}
                    onChange={(e) =>
                      handleInputChange(component.id, e.target.value)
                    }
                  />
                </div>
              )}
              {component.type === "button" && component.code && (
                <button
                  className="px-4 p-2 mt-2 font-semibold w-full md:w-40 overflow-x-hidden text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                  id={component.id}
                  onClick={() => handleRun(component.code!, inputValues)}
                >
                  {component.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="mb-4">
          <h2 className="text-xl font-bold">Output Format:</h2>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="json">JSON</option>
            <option value="table">Table</option>
          </select>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold">Output:</h2>
          {outputFormat === "json" ? (
            <pre className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
              {/* {JSON.stringify(outputCode, null, 2)} */}
              {outputCode
                ? JSON.stringify(outputCode, null, 2)
                : "No output available"}
            </pre>
          ) : (
            <div className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
              {formatOutput(outputCode)}
            </div>
          )}
        </div>
      </div>

      {/* {feedback && (
        <div className="flex flex-col justify-center items-center -ml-[1rem] md:-ml-[2.5rem] lg:-ml-[6.5rem] xl:-ml-[11.5rem] fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
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
  );
};

export default UserActionPage;

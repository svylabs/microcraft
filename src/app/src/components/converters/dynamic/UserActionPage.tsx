import React, { useEffect, useState } from "react";
import "./ActionPage.scss";
import { useLocation, useParams } from "react-router-dom";
import { BASE_API_URL } from "~/components/constants";
import * as d3 from "d3";

interface Output {
  [key: string]: any;
}

const UserActionPage = () => {
  const location = useLocation();
  const { appId } = useParams<{ appId: string }>();
  const [output, setOutput] = useState<any>(location?.state?.output || {});
  const [components, setComponents] = useState(
    output?.component_definition || []
  );
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [outputCode, setOutputCode] = useState<Output | string>();
  const [outputFormat, setOutputFormat] = useState<string>("json");
  const [graphType, setGraphType] = useState<string>("bar");

  useEffect(() => {
    if (components.length === 0) {
      fetch(`${BASE_API_URL}/dynamic-component/${appId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Component detail: ", data);
          setComponents(data.component_definition || []);
          setOutput(data);
        });
    }
  }, []);

  useEffect(() => {
    if (outputFormat === "graph") {
      renderGraph();
    }
  }, [outputFormat, outputCode, graphType]);

  // const renderGraph = () => {
  //   // Remove any existing graph before rendering a new one
  //   d3.select("#graph-container").selectAll("*").remove();
  
  //   if (outputCode && typeof outputCode === "object") {
  //     const svg = d3
  //       .select("#graph-container")
  //       .append("svg")
  //       .attr("width", 500) // Increased width for better axis visibility
  //       .attr("height", 400); // Increased height for better axis visibility
  
  //     const dataValues = Object.values(outputCode);
  //     const dataLabels = Object.keys(outputCode); // Assuming data labels are keys
  
  //     const xScale = d3
  //       .scaleBand()
  //       .domain(dataLabels)
  //       .range([50, 450]) // Adjusted range for better axis placement
  //       .padding(0.1);
  
  //     const yScale = d3
  //       .scaleLinear()
  //       .domain([0, d3.max(dataValues) || 0])
  //       .range([350, 50]); // Adjusted range for better axis placement
  
  //     // Render x-axis
  //     svg
  //       .append("g")
  //       .attr("transform", "translate(0,350)")
  //       .call(d3.axisBottom(xScale))
  //       .selectAll("text")
  //       .attr("transform", "rotate(-45)") // Rotate x-axis labels for better readability
  //       .style("text-anchor", "end");
  
  //     // Render y-axis labels
  //     svg
  //       .selectAll(".y-label")
  //       .data(yScale.ticks())
  //       .enter()
  //       .append("text")
  //       .attr("class", "y-label")
  //       .attr("x", 40) // Adjusted x position for y-axis labels
  //       .attr("y", (d) => yScale(d) + 5) // Adjusted y position for y-axis labels
  //       .text((d) => d.toFixed(2)) // Adjusted formatting for y-axis labels
  //       .style("text-anchor", "end")
  //       .attr("alignment-baseline", "middle");
  
  //     // Render y-axis line
  //     svg
  //       .append("line")
  //       .attr("x1", 50) // Adjusted x position for y-axis line
  //       .attr("y1", 50)
  //       .attr("x2", 50) // Adjusted x position for y-axis line
  //       .attr("y2", 350)
  //       .attr("stroke", "black")
  //       .attr("stroke-width", 1);
  
  //     if (graphType === "bar") {
  //       // Render bars
  //       svg
  //         .selectAll("rect")
  //         .data(dataValues)
  //         .enter()
  //         .append("rect")
  //         .attr("x", (d, i) => xScale(dataLabels[i]))
  //         .attr("y", (d) => yScale(d))
  //         .attr("width", xScale.bandwidth())
  //         .attr("height", (d) => 350 - yScale(d))
  //         .attr("fill", "steelblue");
  //     } else if (graphType === "line") {
  //       // Render line
  //       const line = d3
  //         .line()
  //         .x((d, i) => xScale(dataLabels[i]) + xScale.bandwidth() / 2)
  //         .y((d) => yScale(d));
  
  //       svg
  //         .append("path")
  //         .datum(dataValues)
  //         .attr("fill", "none")
  //         .attr("stroke", "steelblue")
  //         .attr("stroke-width", 1.5)
  //         .attr("d", line);
  //     }
  //   } else {
  //     console.log("Output code is not an object or is undefined.");
  //   }
  // };

  const renderGraph = () => {
    // Remove any existing graph before rendering a new one
    d3.select("#graph-container").selectAll("*").remove();
  
    if (outputCode && typeof outputCode === "object") {
      const svg = d3
        .select("#graph-container")
        .append("svg")
        .attr("width", 500) // Increased width for better axis visibility
        .attr("height", 400); // Increased height for better axis visibility
  
      const dataValues = Object.values(outputCode);
      const dataLabels = Object.keys(outputCode); // Assuming data labels are keys
  
      const xScale = d3
        .scaleBand()
        .domain(dataLabels)
        .range([50, 450]) // Adjusted range for better axis placement
        .padding(0.1);
  
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataValues) || 0])
        .range([350, 50]); // Adjusted range for better axis placement
  
      // Render x-axis
      svg
        .append("g")
        .attr("transform", "translate(0,350)")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)") // Rotate x-axis labels for better readability
        .style("text-anchor", "end");
  
      // Render y-axis labels
      const yAxisTicks = yScale.ticks();
      const yAxisLabelOffset = (400 - 50) / yAxisTicks.length; // Calculate offset based on SVG height and number of ticks
  
      svg
        .selectAll(".y-label")
        .data(yAxisTicks)
        .enter()
        .append("text")
        .attr("class", "y-label")
        .attr("x", 40) // Adjusted x position for y-axis labels
        .attr("y", (d) => yScale(d) + yAxisLabelOffset / 2) // Adjusted y position for y-axis labels
        .text((d) => d.toFixed(2)) // Adjusted formatting for y-axis labels
        .style("text-anchor", "end")
        .attr("alignment-baseline", "middle");
  
      // Render y-axis line
      svg
        .append("line")
        .attr("x1", 50) // Adjusted x position for y-axis line
        .attr("y1", 50)
        .attr("x2", 50) // Adjusted x position for y-axis line
        .attr("y2", 350)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
  
      if (graphType === "bar") {
        // Render bars
        svg
          .selectAll("rect")
          .data(dataValues)
          .enter()
          .append("rect")
          .attr("x", (d, i) => xScale(dataLabels[i]))
          .attr("y", (d) => yScale(d))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => 350 - yScale(d))
          .attr("fill", "steelblue");
      } else if (graphType === "line") {
        // Render line
        const line = d3
          .line()
          .x((d, i) => xScale(dataLabels[i]) + xScale.bandwidth() / 2)
          .y((d) => yScale(d));
  
        svg
          .append("path")
          .datum(dataValues)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);
      }
    } else {
      console.log("Output code is not an object or is undefined.");
    }
  };
  
  
  
  const handleInputChange = (id: string, value: string) => {
    setData((prevInputValues) => ({
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
      let vals = data;
      if (typeof result === "object") {
        for (const key in result) {
          vals[key] = result[key];
        }
        setData(vals);
      }
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
    window.location.href = "/";
  };

  return (
    <div className="image-pdf p-4 xl:py-10 min-h-[100vh] flex flex-col">
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
              {appId}
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
              {appId}
            </h1>
          </div>
          <ul className="whitespace-normal break-words">
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
                      value={data[component.id] || ""}
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
                    onClick={() => handleRun(component.code!, data)}
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
              <option value="graph">Graph</option>
            </select>
          </div>

          {outputFormat === "graph" && (
            <div className="mb-4">
              <h2 className="text-xl font-bold">Graph Type:</h2>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="barGraph"
                  name="graphType"
                  value="bar"
                  checked={graphType === "bar"}
                  onChange={() => setGraphType("bar")}
                  className="mr-2"
                />
                <label htmlFor="barGraph">Bar Graph</label>
                <input
                  type="radio"
                  id="lineGraph"
                  name="graphType"
                  value="line"
                  checked={graphType === "line"}
                  onChange={() => setGraphType("line")}
                  className="ml-4 mr-2"
                />
                <label htmlFor="lineGraph">Line Graph</label>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-xl font-bold">Output:</h2>
            {outputFormat === "json" ? (
              <pre className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
                {outputCode
                  ? JSON.stringify(outputCode, null, 2)
                  : "No output available"}
              </pre>
            ) : outputFormat === "table" ? (
              <div className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
                {formatOutput(outputCode)}
              </div>
            ) : outputFormat === "graph" ? (
              <div
                id="graph-container"
                className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg"
              ></div>
            ) : (
              <div>hello rohit</div> // Render nothing for graph output, as it's handled separately
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActionPage;

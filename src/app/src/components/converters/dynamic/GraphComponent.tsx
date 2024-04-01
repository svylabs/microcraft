import React, { useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  output: any;
  graphType: string;
  configurations: any;
}

const GraphComponent: React.FC<Props> = ({
  output,
  graphType: defaultGraphType,
  configurations,
}) => {
  const [config, setConfig] = useState<Props["configurations"] | null>(null);
  const [graphType, setGraphType] = useState<string>(defaultGraphType);

  useEffect(() => {
    if (typeof configurations === 'string') {
      try {
        setConfig(JSON.parse(configurations));
      } catch (error) {
        console.error('Error parsing configurations:', error);
      }
    } else if (typeof configurations === 'object') {
      setConfig(configurations);
    } else {
      console.warn('Configurations are not a valid string or object.');
    }
  
    renderGraph();
  }, [output, defaultGraphType, configurations]);  

  
  // const getGraphType = () => {
  //   // Check if config.graphType is available, if yes, use it; otherwise, use graphType
  //   return config?.graphType || graphType;
  // };

  const renderGraph = () => {
    d3.select("#graph-container").selectAll("*").remove();
    const selectedGraphType = config?.graphType || graphType;

    if (output && typeof output === "object") {
      const svgWidth = config?.size?.width || 500;
      const svgHeight = config?.size.height || 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;

      const svg = d3
        .select("#graph-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      const graph = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Add graph title
      svg
        .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", margin.top / 1.8)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(config?.graphTitle);

      // Add x-axis title
      svg
        .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - margin.bottom / 4 + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("⟵ " + config?.axis.xAxis.titleX + " ⟶");

      // Add y-axis title
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(svgHeight / 2))
        .attr("y", margin.left / 3)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("⟵ " + config?.axis.yAxis.titleY + " ⟶");

      const dataValues = Object.values(output).map((value: any) => {
        if (typeof value === "number") {
          return value;
        } else if (typeof value === "boolean") {
          return value ? true : 0;
        } else if (
          typeof value === "string" &&
          !isNaN(parseFloat(value)) &&
          isFinite(parseFloat(value))
        ) {
          return parseFloat(value);
        } else if (
          Array.isArray(value) &&
          value.every((item: any) => typeof item === "number")
        ) {
          return value.reduce((acc: number, curr: number) => acc + curr, 0);
        } else if (typeof value === "object" && value !== null) {
          return Object.values(value).reduce((acc: number, curr: any) => {
            return acc + (typeof curr === "number" ? curr : 0);
          }, 0);
        } else {
          return 0;
        }
      });
      const dataLabels = Object.keys(output);

      const xScale = d3
        .scaleBand()
        .domain(dataLabels)
        .range([0, graphWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataValues) || 0])
        .range([graphHeight, 0]);

      graph
        .append("g")
        .attr("transform", `translate(0, ${graphHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

      graph
        .append("g")
        .call(d3.axisLeft(yScale))
        .attr("transform", `translate(0, 0)`);

      graph
        .append("line")
        .attr("x1", 0)
        .attr("y1", graphHeight)
        .attr("x2", graphWidth)
        .attr("y2", graphHeight)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

        if (selectedGraphType === "bar") {
        graph
          .selectAll("rect")
          .data(dataValues)
          .enter()
          .append("rect")
          .attr("x", (d, i) => xScale(dataLabels[i]))
          .attr("y", (d) => yScale(d))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => graphHeight - yScale(d))
          .attr("fill", "steelblue")
          .on("mouseover", (event, d) => {
            d3.select(event.target).attr("fill", "orange");
            const xPos =
              parseFloat(d3.select(event.target).attr("x")) +
              xScale.bandwidth() / 2;
            const yPos = parseFloat(d3.select(event.target).attr("y")) + 10;
            graph
              .append("text")
              .attr("class", "tooltip")
              .attr("x", xPos)
              .attr("y", yPos)
              .attr("text-anchor", "middle")
              .text(d)
              .style("font-size", "12px");
          })
          .on("mouseout", (event) => {
            d3.select(event.target).attr("fill", "steelblue");
            graph.select(".tooltip").remove();
          });
      } else if (selectedGraphType === "line") {
        const line = d3
          .line()
          .x((d, i) => xScale(dataLabels[i]) + xScale.bandwidth() / 2)
          .y((d) => yScale(d))
          .curve(d3.curveLinear);

        graph
          .append("path")
          .datum(dataValues)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", line);

        graph
          .selectAll("circle")
          .data(dataValues)
          .enter()
          .append("circle")
          .attr("cx", (d, i) => xScale(dataLabels[i]) + xScale.bandwidth() / 2)
          .attr("cy", (d) => yScale(d))
          .attr("r", 4)
          .attr("fill", "steelblue")
          .on("mouseover", (event, d) => {
            d3.select(event.target).attr("fill", "orange");
            const xPos = parseFloat(d3.select(event.target).attr("cx")) + 60;
            const yPos = parseFloat(d3.select(event.target).attr("cy")) + 10;
            svg
              .append("text")
              .attr("class", "tooltip")
              .attr("x", xPos)
              .attr("y", yPos)
              .attr("text-anchor", "middle")
              .text(d)
              .style("font-size", "12px");
          })
          .on("mouseout", (event) => {
            d3.select(event.target).attr("fill", "steelblue");
            svg.select(".tooltip").remove();
          });
      }
    } else {
      console.log("Output code is not an object or is undefined.");
    }
  };

  return (
    <div
      id="graph-container"
      className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto border border-gray-300 rounded-lg"
    ></div>
  );
};

export default GraphComponent;

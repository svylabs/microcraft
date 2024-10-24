import React, { useState } from "react";
import "./JsonDiffConverter.css";
import * as jsondiffpatch from "jsondiffpatch";
import { JSONTree } from "react-json-tree";
import { diffChars } from "diff";
import copyClipboard from "../../photos/copy-svgrepo-com.svg";

interface NumberedTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const NumberedTextarea: React.FC<NumberedTextareaProps> = ({
  value,
  onChange,
  onKeyDown,
}) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const num = e.target.value.split("\n").length;
    setLineNumbers(Array.from(Array(num).keys(), (i) => i + 1));
    onChange(e);
  };

  const [popup, setPopup] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
    }, 1500);
  };

  return (
    <div className="editor relative">
      <div className="numbers ">
        {lineNumbers.map((lineNumber) => (
          <span key={lineNumber}>{lineNumber}</span>
        ))}
      </div>
      <textarea
      className="md:w-full lg:min-w-[500px]"
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={onKeyDown}
        cols={30}
        rows={10}
      ></textarea>
      <button
        onClick={() => copyToClipboard(value)}
        className="absolute right-0 -top-7 hover:bg-blue-600 hover:rounded focus:outline-none"
      >
        <img src={copyClipboard} alt="copyClipboard" className="p-1"></img>
      </button>
      {popup && (
        <div className="absolute right-0 lg:-right-4 -top-14 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
          copied!
        </div>
      )}
    </div>
  );
};

const JsonDiffConverter: React.FC = () => {
  const [json1, setJson1] = useState<string>("");
  const [json2, setJson2] = useState<string>("");
  const [highlightedJson, setHighlightedJson] = useState<React.ReactNode[] | null>(null);
  const [diff, setDiff] = useState<any | null>(null);
  const [diffHighlights, setDiffHighlights] = useState<
    readonly { value: string; added?: boolean; removed?: boolean }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    try {
      const parsedJson1 = JSON.parse(json1);
      const parsedJson2 = JSON.parse(json2);

      const delta = calculateDifferences(parsedJson1, parsedJson2);
      const delto = jsondiffpatch.diff(parsedJson1, parsedJson2);
      const diffs = diffChars(
        JSON.stringify(parsedJson1, null, 2),
        JSON.stringify(parsedJson2, null, 2)
      );

      applyHighlightingToTextArea(delta);
      setDiffHighlights(diffs);
      setDiff(delto);
      setError(null);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  const calculateDifferences = (json1: any, json2: any) => {
    const delta: { [key: number]: boolean } = {};

    const json1Lines = JSON.stringify(json1, null, 2).split("\n");
    const json2Lines = JSON.stringify(json2, null, 2).split("\n");

    for (let i = 0; i < Math.max(json1Lines.length, json2Lines.length); i++) {
      if (json1Lines[i] !== json2Lines[i]) {
        delta[i] = true;
      }
    }

    return delta;
  };

  const applyHighlightingToTextArea = (delta: any) => {
    const lines = json2.split("\n");
    const highlightedLines = lines.map((line, index) => (
      <div key={index} className={delta[index] ? "bg-yellow-600" : ""}>
        {line}
      </div>
    ));
    setHighlightedJson(highlightedLines);
  };

  const renderComparisonResult = () => {
    return highlightedJson ? (
      <div className="bg-[#282a3a] rounded p-2 w-full min-h-56">
        {highlightedJson &&
          highlightedJson.map((line, index) => (
            <div className="converter-container flex">
              <div className="converter-num">
                <span>{index + 1}</span>
              </div>
              <div className="converter-diff">{line}</div>
            </div>
          ))}
      </div>
    ) : null;
  };

  const renderHighlightedText = (
    text: string,
    added?: boolean,
    removed?: boolean
  ) => {
    const className = added ? "bg-green-200" : removed ? "bg-red-200" : "";
    return <span className={className}>{text}</span>;
  };

  return (
    <div className="image-pdf rounded-lg container mx-auto p-4 lg:p-10 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">JSON Comparison Tool</h1>
      <div className="flex flex-col xl:flex-row gap-10 lg:gap-15 flex-grow mt-2 md:mt-5">
        <NumberedTextarea
          value={json1}
          onChange={(e) => setJson1(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              const textarea = e.target as HTMLTextAreaElement;
              const start = textarea.selectionStart ?? 0;
              const end = textarea.selectionEnd ?? 0;

              const newValue =
                textarea.value.substring(0, start) +
                "\t" +
                textarea.value.substring(end);

              textarea.value = newValue;

              e.preventDefault();
            }
          }}
        />
        {highlightedJson ? null : (
          <NumberedTextarea
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                const textarea = e.target as HTMLTextAreaElement;
                const start = textarea.selectionStart ?? 0;
                const end = textarea.selectionEnd ?? 0;

                const newValue =
                  textarea.value.substring(0, start) +
                  "\t" +
                  textarea.value.substring(end);

                textarea.value = newValue;

                e.preventDefault();
              }
            }}
          />
        )}
        {renderComparisonResult()}
      </div>
      <div className="flex mt-4">
        <button
          onClick={handleCompare}
          className="mx-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Compare
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">JSON Differences</h2>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : diff ? (
          <JSONTree data={diff} invertTheme={true} />
        ) : (
          <p>No differences found</p>
        )}
      </div>
      <div className="mt-4 ">
        {diffHighlights && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Highlighted Differences</h2>
            <div className="bg-white rouded p-2 rounded space-x-1 shadow-md">
              {diffHighlights.map((part, index) => (
                <span
                  key={index}
                  className={
                    part.added
                      ? "bg-green-800"
                      : part.removed
                        ? "bg-red-600"
                        : ""
                  }
                >
                  {part.added || part.removed
                    ? part.value
                    : renderHighlightedText(
                        part.value,
                        part.added,
                        part.removed
                      )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonDiffConverter;

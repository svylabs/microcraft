import React, { useState, ChangeEvent } from "react";
import { Button } from "@mantine/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import copyClipboard from "../../photos/copy-svgrepo-com.svg";

interface NumberedTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  lineNumbers: number[];
}

const NumberedTextarea: React.FC<NumberedTextareaProps> = ({
  value,
  onChange,
  onKeyDown,
  lineNumbers,
}) => {
  return (
    <div className="editor w-full">
      <div className="numbers">
        {lineNumbers.map((lineNumber) => (
          <span key={lineNumber}>{lineNumber}</span>
        ))}
      </div>
      <textarea
      className="md:w-full lg:min-w-[500px]"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        cols={30}
        rows={10}
      ></textarea>
    </div>
  );
};

const PrettyJsonConverter = () => {
  const [jsonString, setJsonString] = useState<string>("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [inputPopup, setInputPopup] = useState(false);
  const [outputPopup, setOutputPopup] = useState(false);

  const handleInputChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputString = event.currentTarget.value;
    setJsonString(inputString);

    try {
      const parsedObject = await parseJsonAsync(inputString);
      setParsedJson(parsedObject);
    } catch (error) {
      setParsedJson(null);
    }
  };

  const handleValidateClick = async () => {
    try {
      await parseJsonAsync(jsonString);
      toast.success("The JSON is valid", { position: "bottom-right" });
    } catch (error) {
      toast.error("Invalid JSON", { position: "bottom-right" });
    }
  };

  const parseJsonAsync = async (inputString: string): Promise<any> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return JSON.parse(inputString);
    } catch (error) {
      throw new Error("Invalid JSON");
    }
  };

  const copyToClipboard = (text: string, type: "input" | "output") => {
    navigator.clipboard.writeText(text);
    if (type === "input") {
      setInputPopup(true);
      setTimeout(() => {
        setInputPopup(false);
      }, 1500);
    } else {
      setOutputPopup(true);
      setTimeout(() => {
        setOutputPopup(false);
      }, 1500);
    }
  };

  return (
    <div className="image-pdf rounded-lg container mx-auto p-4 lg:p-10">
      <div className="flex flex-col gap-5 xl:flex-row lg:gap-10">
        <div className="flex-1 ">
          <div className="flex flex-wrap relative">
            <button
              onClick={() => copyToClipboard(jsonString, "input")}
              className="absolute right-0 xl:-right-1 top-1 hover:bg-blue-600 hover:rounded focus:outline-none"
            >
              <img
                src={copyClipboard}
                alt="copyClipboard"
                className="p-1"
              ></img>
            </button>

            {inputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-6 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}

            <label className="text-lg font-medium p-1">
              Input (JSON string)
            </label>
          </div>
          <NumberedTextarea
            onChange={handleInputChange}
            value={jsonString}
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
            lineNumbers={jsonString.split("\n").map((_, i) => i + 1)}
          />
        </div>
        <div className="flex-1">
        <div className="flex flex-wrap relative">
            <button
              onClick={() => copyToClipboard(JSON.stringify(parsedJson, null, 2), "output")}
              className="absolute right-0 xl:-right-1 top-1 hover:bg-blue-600 hover:rounded focus:outline-none"
            >
              <img
                src={copyClipboard}
                alt="copyClipboard"
                className="p-1"
              ></img>
            </button>
            {outputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-6 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}
          <label className="text-lg font-medium p-1">
            Output (JavaScript Object)
          </label>
          </div>
          <NumberedTextarea
            value={JSON.stringify(parsedJson, null, 2)}
            onChange={() => {}}
            onKeyDown={() => {}}
            lineNumbers={
              parsedJson
                ? JSON.stringify(parsedJson, null, 2)
                    .split("\n")
                    .map((_, i) => i + 1)
                : [1]
            }
          />
        </div>
      </div>
      <div className="flex">
        <Button
          className="mt-4 bg-red-500 mx-auto text-white"
          onClick={handleValidateClick}
          disabled={!jsonString.trim()}
        >
          Validate
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PrettyJsonConverter;

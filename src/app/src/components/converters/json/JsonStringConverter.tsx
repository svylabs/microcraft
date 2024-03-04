import { Textarea, Button } from "@mantine/core";
import { useState, ChangeEvent } from "react";
import copyClipboard from "../../photos/copy-svgrepo-com.svg";

const JsonStringConverter = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [isJsonTostring, setIsJsonTostring] = useState<boolean>(true);
  const [inputPopup, setInputPopup] = useState(false);
  const [outputPopup, setOutputPopup] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.currentTarget.value);

    try {
      const parsedObject = JSON.parse(event.currentTarget.value);
      setOutputValue(JSON.stringify(parsedObject, null, 2));
    } catch (error) {
      setOutputValue("");
    }
  };

  const handleConversion = () => {
    setIsJsonTostring(!isJsonTostring);

    // Swap input and output values
    setInputValue(outputValue);
    setOutputValue("");

    // Clear parsed JSON when switching modes
    if (isJsonTostring) {
      setOutputValue("");
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
    <div className="image-pdf rounded-lg container mx-auto p-4">
      <div className="flex flex-col">
        <div className="flex flex-wrap relative">
          <button
            onClick={() => copyToClipboard(inputValue, "input")}
            className="absolute right-0 top-5 hover:bg-blue-600 hover:rounded focus:outline-none"
          >
            <img src={copyClipboard} alt="copyClipboard" className="p-1"></img>
          </button>
          {inputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-3 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}
          <label className="mt-4 text-lg font-medium p-1">
            Input({isJsonTostring ? "JSON" : "JSON string"})
          </label>
        </div>
        <Textarea
          placeholder={`Enter ${isJsonTostring ? "JSON" : "JSON string"} here`}
          onChange={handleInputChange}
          value={inputValue}
          className="mb-5 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mt-2"
        />
        <div className="flex flex-wrap relative">
          <button
            onClick={() => copyToClipboard(outputValue, "output")}
            className="absolute right-0 top-5 hover:bg-blue-600 hover:rounded focus:outline-none"
          >
            <img src={copyClipboard} alt="copyClipboard" className="p-1"></img>
          </button>
          {outputPopup && (
                  <div className="absolute right-0 lg:-right-4 -top-3 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                    copied!
                  </div>
                )}
        <label className="mt-4 text-lg font-medium p-1">
          Output({isJsonTostring ? "JSON string" : "JSON"})
        </label>
        </div>
        <Textarea
          placeholder={`Output ${isJsonTostring ? "JSON string" : "JSON"}`}
          value={outputValue}
          readOnly
          className="mb-5 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mt-2"
        />
        <Button
          className="font-bold text-lg text-white rounded mx-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
          onClick={handleConversion}
          size="sm"
        >
          {isJsonTostring ? "Convert to JSON string" : "Convert to JSON"}
        </Button>
      </div>
    </div>
  );
};

export default JsonStringConverter;

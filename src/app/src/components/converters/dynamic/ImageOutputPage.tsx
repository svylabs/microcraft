import React, { useState, useEffect, useRef } from "react";

const ImageOutputPage = ({ handleBackToFirstPage, selectedCodeId }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");

  const codeSetsString = localStorage.getItem("codeSets");

  const codeSets =
    codeSetsString !== null ? JSON.parse(codeSetsString) : null;
  const foundQuestionSet = codeSets.find(
    (set) => set.id === selectedCodeId
  );

  const runCode = async () => {
    try {
      const result = await eval(foundQuestionSet.code);
      setOutput(result);
      setShowOutput(true);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const formatOutput = (data) => {
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
                {data.map((item, index) => (
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
              {Object.entries(data).map(([key, value]) => (
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const numbers = numbersRef.current;

    const updateLineNumbers = () => {
      if (textarea && numbers) {
        const lines = textarea.value.split('\n').length;
        numbers.innerHTML = Array.from({ length: lines }, (_, index) => index + 1).join('<br>');
      }
    };

    if (textarea) {
      updateLineNumbers();
      textarea.addEventListener('input', updateLineNumbers);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('input', updateLineNumbers);
      }
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl">{foundQuestionSet.title}</h2>
      <div className="flex bg-gray-900 rounded-md p-2">
              <div
                className="px-2 text-gray-500"
                ref={numbersRef}
                style={{ whiteSpace: "pre-line", overflowY: "hidden" }}
              ></div>
              <textarea
                ref={textareaRef}
                className="flex-1 bg-gray-900 text-white outline-none placeholder:italic"
                style={{ overflowY: "hidden" }}
                defaultValue={foundQuestionSet.code}
                rows={10}
                cols={30}
                readOnly
              ></textarea>
            </div>
      <div className="flex justify-between">
      <button className="block px-4 py-2 mb-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none" onClick={runCode}>Run Code</button>
      <button className="block px-4 py-2 mb-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none" onClick={handleBackToFirstPage}>Back</button>
      </div>
      {showOutput && (
        <div>
          <h2>Output:</h2>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="table">Table</option>
          </select>
          <div>
            {outputFormat === "json" ? (
              <pre>{JSON.stringify(output, null, 2)}</pre>
            ) : (
              <div>{formatOutput(output)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOutputPage;

import React, { useState, useRef, useEffect } from "react";
// import OutputPage from "./OutputPage";

interface Output {
  [key: string]: any;
}

const DynamicComponent = () => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<Output | string>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showOutput, setShowOutput] = useState<boolean>(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const data = { title, description, image, code };
    const existingData = localStorage.getItem("formData");
    const parsedExistingData = existingData ? JSON.parse(existingData) : [];
    localStorage.setItem(
      "formData",
      JSON.stringify([...parsedExistingData, data])
    );

    const codeId = localStorage.getItem("codeId");
    const codeSets = localStorage.getItem("codeSets");
    const parsedQuestionSets = codeSets ? JSON.parse(codeSets) : [];
    const updatedSets = parsedQuestionSets.map((set) =>
      codeId !== null && set.id === codeId ? { ...set, title, code } : set
    );
    localStorage.setItem("codeSets", JSON.stringify(updatedSets));
    const newSet = { codes: [code] };

    try {
      const result = await eval(code);
      setOutput(result);
      setShowOutput(true);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
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
        <div>
          <h1>Dynamic Component</h1>
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-[#85909B] text-lg xl:text-xl"
            >
              Components Title (Limit: 22 characters)
            </label>
            <input
              type="text"
              maxLength={22}
              className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 py-3 px-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] placeholder:italic"
              placeholder="Enter components title.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <br></br>

            <label
              htmlFor="description"
              className="text-[#85909B] text-lg xl:text-xl"
            >
              Components Description
            </label>
            <textarea
              className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] xl:px-6 resize-none placeholder:italic"
              placeholder="Enter components description.."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <br></br>
            <input
              type="file"
              className="w-40"
              onChange={handleImageUpload}
            ></input>
            <br></br>
            <label htmlFor="code" className="text-[#85909B] text-lg xl:text-xl">
              Write your code
            </label>
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your JavaScript code here"
                cols={30}
                rows={10}
              ></textarea>
            </div>
          </div>
          <button className="block px-4 py-2 mb-2 text-white bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none" onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  );
};

export default DynamicComponent;

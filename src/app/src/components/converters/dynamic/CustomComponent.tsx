import React, { useState, useEffect, useRef } from "react";
import pin from "../../photos/paperclip-solid.svg";
import ActionPage from "./ActionPage";
import "./CustomComponent.scss";
import trash from "../../photos/trash-can-regular.svg";
import arrow from "../../photos/angle-right-solid.svg"
interface CustomComponent {
  id: string;
  label: string;
  type: string;
  placement: string;
  code?: string;
}

const CustomComponent: React.FC = () => {
  const [components, setComponents] = useState<CustomComponent[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [currentComponent, setCurrentComponent] = useState<CustomComponent>({
    id: "",
    label: "",
    type: "text",
    placement: "input",
    code: "",
  });
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    image: false,
  });
  const [showNext, setShowNext] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentComponent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddComponent = () => {
    setComponents((prevState) => [...prevState, currentComponent]);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [currentComponent.id]: "",
    }));
    setCurrentComponent({
      id: "",
      label: "",
      type: "text",
      placement: "input",
      code: "",
    });
  };

  const handleSaveNext = () => {
    // if (!title.trim() || !image.trim()) {
    if (title.trim()) {
      setFieldErrors({
        title: !title.trim(),
        image: !image.trim(),
      });
      return;
    } else {
      setShowNext(true);
    }
  };

  const handlePreview = async () => {
    console.log(components);
    setShowOutput(true);
  };

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((prevComponents) =>
      prevComponents.filter((component) => component.id !== id)
    );
    setInputValues((prevInputValues) => {
      const updatedInputValues = { ...prevInputValues };
      delete updatedInputValues[id];
      return updatedInputValues;
    });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const numbers = numbersRef.current;

    const updateLineNumbers = () => {
      if (textarea && numbers) {
        const lines = textarea.value.split("\n").length;
        numbers.innerHTML = Array.from(
          { length: lines },
          (_, index) => index + 1
        ).join("<br>");
      }
    };

    if (textarea) {
      updateLineNumbers();
      textarea.addEventListener("input", updateLineNumbers);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", updateLineNumbers);
      }
    };
  }, [currentComponent.type]);

  if (showOutput) {
    return <ActionPage output={components} />;
  }

  return (
    <div className="bg-gray-100 shadow-lg rounded-md">
      {!showNext && (
        <div className="p-1 md:p-4 flex flex-col gap-5">
          <div className="flex gap-2 md:gap-8 lg:gap-12 border-b pb-5">
            <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
              <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3.5 rounded-full font-bold">
                1
              </span>
              Configure basic details
            </p>
            <img src={arrow} alt="arrow"></img>
            <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
              <span className="bg-[#DADBE2]  p-1 px-3 md:px-3.5 rounded-full font-bold">
                2
              </span>
              Configure inputs / outputs
            </p>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-[#727679] font-semibold text-lg xl:text-xl"
            >
              Components Title (Limit: 22 characters)
            </label>
            <input
              type="text"
              maxLength={22}
              className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 px-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] placeholder:italic"
              placeholder="Enter components title.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            {fieldErrors.title && (
              <p className="text-red-500 mt-2">Title is required.</p>
            )}
            <br></br>

            <label
              htmlFor="description"
              className="text-[#727679] font-semibold text-lg xl:text-xl"
            >
              Components Description
            </label>
            <textarea
              className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] resize-none placeholder:italic"
              placeholder="Enter components description.."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col md:flex-row mt-2 justify-between gap-5">
            <div className="flex md:gap-5 justify-between">
              <p className="file-upload flex justify-center p-2 md:p-3 rounded-md gap-3 xl:text-lg cursor-pointer">
                <img
                  src={pin}
                  alt="pin"
                  className="object-scale-down self-center lg:w-6 lg:h-7"
                ></img>
                <span className="text-[#2E4055] font-medium self-center ">
                  Attach file
                </span>
                <input
                  type="file"
                  className="w-40"
                  onChange={handleImageUpload}
                ></input>
              </p>
              <p className="text-[#727679] self-center md:text-lg">
                Choose Thumbnail
              </p>
            </div>
            {fieldErrors.image && (
              <p className="md:hidden text-red-500 -mt-2">Image is required.</p>
            )}
            <button
              className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
              onClick={handleSaveNext}
              type="submit"
            >
              Save & Next
            </button>
          </div>
          {fieldErrors.image && (
            <p className="hidden md:block text-red-500 -mt-2">
              Image is required.
            </p>
          )}
        </div>
      )}

      {showNext && (
        <div className="p-1 md:p-4">
          <div className="flex gap-2 md:gap-8 lg:gap-12 border-b pb-5">
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3.5 rounded-full font-bold">
              1
            </span>
            Configure basic details
          </p>
          <img src={arrow} alt="arrow"></img>
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3.5 rounded-full font-bold">
              2
            </span>
            Configure inputs / outputs
          </p>
        </div>
          <label className="block mb-2 mt-5 text-[#727679] font-semibold text-lg xl:text-xl">
            Type:
            <select
              className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none"
              name="type"
              value={currentComponent.type}
              onChange={handleChange}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="image">Image</option>
              <option value="file">File</option>
              <option value="button">Button</option>
            </select>
          </label>

          <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
            ID:
            <input
              className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none placeholder:italic placeholder:font-normal"
              type="text"
              name="id"
              value={currentComponent.id}
              onChange={handleChange}
              placeholder="Type ID here.."
            />
          </label>

          <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
            Label:
            <input
              className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none placeholder:italic placeholder:font-normal"
              type="text"
              name="label"
              value={currentComponent.label}
              onChange={handleChange}
              placeholder="Type label here.."
            />
          </label>

          {currentComponent.type !== "button" && (
            <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
              Placement:
              <select
                className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none"
                name="placement"
                value={currentComponent.placement}
                onChange={handleChange}
              >
                <option value="input">Input</option>
                <option value="output">Output</option>
                <option value="action">Action</option>
              </select>
            </label>
          )}

          {currentComponent.type === "button" && (
            <div>
              <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
                Placement:
                <select
                  className="block w-full p-2 mt-1 bg-white border border-gray-300 rounded-md focus:outline-none"
                  name="placement"
                  value={currentComponent.placement}
                  onChange={handleChange}
                >
                  <option value="output">Output</option>
                  <option value="action">Action</option>
                </select>
              </label>

              <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
                Code:
              </label>
              <div className="flex bg-gray-900 rounded-md p-2">
                <div
                  className="px-2 text-gray-500"
                  ref={numbersRef}
                  style={{ whiteSpace: "pre-line", overflowY: "hidden" }}
                ></div>
                <textarea
                  ref={textareaRef}
                  className="flex-1 bg-gray-900 text-white outline-none"
                  style={{ overflowY: "hidden" }}
                  placeholder="Enter your JavaScript code here"
                  cols={30}
                  rows={10}
                  name="code"
                  value={currentComponent.code}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          )}

          <button
            className="block w-full md:w-60 font-bold mx-auto p-3 mt-4 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
            onClick={handleAddComponent}
          >
            Add Component
          </button>

          <div className="md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
            <h2 className="mt-6 text-2xl font-bold">Added Components:</h2>
            <ul>
              {components.map((component, index) => (
                <li key={index} className="mb-4">
                  ID: {component.id}, Label: {component.label}, Type:{" "}
                  {component.type}, Placement: {component.placement}
                  {component.code && `, Code: ${component.code}`}
                  <br />
                  {component.type !== "button" && (
                    <div>
                      <div className="flex justify-between">
                        <label className="text-slate-500 font-semibold text-lg xl:text-xl">
                          {component.label}:
                        </label>
                        <button
                          onClick={() => handleDeleteComponent(component.id)}
                        >
                          <img src={trash} alt="trash"></img>
                        </button>
                      </div>
                      <input
                        className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        type={component.type}
                        id={component.id}
                        value={inputValues[component.id]}
                        onChange={(e) =>
                          handleInputChange(component.id, e.target.value)
                        }
                      />
                    </div>
                  )}
                  {component.type === "button" && component.code && (
                    <div>
                      <div className="flex justify-between">
                        <label className="text-slate-500 font-semibold text-lg xl:text-xl">
                          {component.label}:
                        </label>
                        <button
                          onClick={() => handleDeleteComponent(component.id)}
                        >
                          <img src={trash} alt="trash"></img>
                        </button>
                      </div>
                      <button
                        className="block p-2 w-full text-white bg-red-500 border border-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                        id={component.id}
                      >
                        {component.label}
                      </button>
                    </div>
                  )}
                  {/* <button
                    className=""
                    onClick={() => handleDeleteComponent(component.id)}
                  >
                    <img src={trash} alt="trash"></img>
                  </button> */}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="p-3 px-5 font-semibold text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700"
              onClick={handlePreview}
            >
              Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomComponent;

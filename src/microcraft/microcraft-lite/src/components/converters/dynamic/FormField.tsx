import React from "react";

interface GenericFormElementProps {
  type: string;
  id: string;
  label: string;
  value: any;
  config?: any;
  options?: string[];
  handleChange: (id: string, value: any) => void;
}

const GenericFormElement: React.FC<GenericFormElementProps> = ({
  type,
  id,
  label,
  value,
  config,
  options,
  handleChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(id, e.target.value);
  };

  const renderElement = () => {
    switch (type) {
      case "text":
      case "number":
      case "file":
        return (
          <input
            type={type}
            id={id}
            value={value}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
            {...(config && JSON.parse(config))}
          />
        );

      case "dropdown":
        return (
          <select
            id={id}
            value={value}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
          >
            {options?.map((option, idx) => (
              <option key={idx} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
            {options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}_${idx}`}
                  name={id}
                  value={option.trim()}
                  checked={value === option}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`${id}_${idx}`}>{option.trim()}</label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
            {options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${id}_${idx}`}
                  name={id}
                  value={option.trim()}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`${id}_${idx}`}>{option.trim()}</label>
              </div>
            ))}
          </div>
        );

      case "slider":
        const sliderConfig = JSON.parse(config);
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              id={id}
              min={sliderConfig.interval.min}
              max={sliderConfig.interval.max}
              step={sliderConfig.step}
              value={value}
              onChange={handleInputChange}
              className="w-full md:w-[60%] h-8"
            />
            <span className="font-semibold">{value}</span>
          </div>
        );

      case "button":
        return (
          <button
            id={id}
            className="block p-2 w-full text-white bg-red-500 border border-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
            style={{ ...(config && JSON.parse(config)) }}
          >
            {label}
          </button>
        );

      case "textarea":
        return (
          <textarea
            id={id}
            value={value}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
            rows={4}
            {...(config && JSON.parse(config))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-[#727679] font-semibold text-lg xl:text-xl">
        {label}:
      </label>
      {renderElement()}
    </div>
  );
};

export default GenericFormElement;

import React from "react";

interface RadioProps {
  id: string;
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const RadioComponent: React.FC<RadioProps> = ({
  id,
  label,
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <div>
      <label>{label}:</label>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`${id}_${index}`}
            name={id}
            value={option}
            checked={selectedOption === option}
            onChange={(e) => onChange(e.target.value)}
          />
          <label htmlFor={`${id}_${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioComponent;

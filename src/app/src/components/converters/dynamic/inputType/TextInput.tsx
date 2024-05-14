import React from "react";

interface TextInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
};

export default TextInput;

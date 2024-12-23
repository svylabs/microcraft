import React from "react";

const AppCard = ({
  index,
  title,
  description,
  icon,
  onSelected,
}: {
  index: number;
  title: string;
  description: string;
  icon?: string;
  onSelected: (index: number) => void;
}) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={() => onSelected(index)}
    >
      <div className="flex flex-col items-center">
        {icon && (
          <img
            className="w-32 h-32 object-contain rounded-full mb-4"
            src={icon}
            alt={`${title} Icon`}
          />
        )}
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>
    </div>
  );
};

export default AppCard;

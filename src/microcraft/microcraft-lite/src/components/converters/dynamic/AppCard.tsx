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
      className="bg-white p-4 w-80 h-32 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative"
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
        <p className="text-gray-500 text-sm text-center line-clamp-2 hover:line-clamp-none overflow-hidden transition-all duration-300">
          {description}
        </p>
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <div className="h-full overflow-y-auto p-2">
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
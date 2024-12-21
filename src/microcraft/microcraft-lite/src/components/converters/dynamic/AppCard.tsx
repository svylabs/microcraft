import React from "react";

const AppCard = ({ index, title, description, icon, onSelected }: { index: number, title: string; description: string; icon?: string, onSelected: (index: number) => void }) => {
  return (
    <div
      className={`common-button justify-center items-center rounded-lg p-4 shadow-md m-2}`}
                    onClick={() => onSelected(index)}
                  >
                    <div className="home-image">
                      {icon && (
                        <img
                          className="w-full rounded container h-40 object-cover mb-2"
                          src={icon}
                          alt="image-thumbnail"
                        />
                      )}
                      <div className="description text-center h-40 rounded justify-center items-center p-2">
                        <span>{description}</span>
                      </div>
                    </div>
                    <p className="block text-lg font-bold mb-1 text-center">{title}</p>
        </div>
  );
};

export default AppCard;
import React, { useState, useEffect } from "react";

// const Home = ({ handleNext, handleImageClick }) => {
  const Home = () => {
  const savedFormDataString = localStorage.getItem("formData");
  const savedFormData = savedFormDataString
    ? JSON.parse(savedFormDataString)
    : [];
  const [loadedData, setLoadedData] = useState(savedFormData);

  const allCodeIdsString = localStorage.getItem("allCodeIds");
  const allCodeIds = allCodeIdsString ? JSON.parse(allCodeIdsString) : [];

  const codeSetsString = localStorage.getItem("codeSets");
  const codeSets = codeSetsString ? JSON.parse(codeSetsString) : [];

  useEffect(() => {
    setLoadedData(savedFormData);
  }, []);

  const handleCreateComponents = () => {
    const codeId = new Date().getTime().toString();
    localStorage.setItem("codeId", codeId);
    localStorage.setItem("allCodeIds", JSON.stringify([...allCodeIds, codeId]));

    const newSet = { id: codeId, codes: [] };
    localStorage.setItem(
      "codeSets",
      JSON.stringify([...codeSets, newSet])
    );

    // handleNext();
  };

  return (
    <div className="mx-2 mt-3 md:p-3 md:mx-24 lg:mx-20 xl:mx-36 xl:p-5 xl:mt-0 overflow-scroll max-h-[90vh]">
      <div className="flex justify-between">
        <h1 className="text-2xl xl:text-3xl font-medium tracking-tighter">
          Add Custom Components
        </h1>
          <p
            className="cursor-pointer flex gap-3 self-center p-2 px-3 bg-[#31A05D] text-white rounded-md text-lg md:font-medium lg:font-semibold"
            onClick={handleCreateComponents}
          >
            Create New
          </p>
      </div>
      <div className="flex flex-wrap gap-6 mt-5 justify-between">
        {loadedData.map((data, index) => (
          <div
            className="flex flex-col gap-2 bg-white rounded-lg mx-auto sm:mx-0"
            key={index}
            // onClick={() => handleImageClick(allCodeIds[index])}
          >
            <div className="home-image">
              {data.image && (
                <img
                  className="rounded-t-lg container w-64 h-[14.7rem]"
                  src={data.image}
                  alt="code-thumbnail"
                />
              )}
              <div className="description flex flex-col rounded-t-md justify-center items-center p-2 hyphens-auto">
                <span>{data.description}</span>
              </div>
            </div>

            <p className="text-[#414A53] font-semibold text-lg px-5 pt-1">
              {data.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

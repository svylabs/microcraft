import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "~/components/constants";
import flower from "../../photos/flower.png";
import { redirect } from "react-router-dom";

interface FrontendProps {
  lastPrompt?: string;
}

const ConfigureThumbnail: React.FC<FrontendProps> = ({ lastPrompt }) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [popup, setPopup] = useState(false);

  const savedFormDataString = localStorage.getItem("formData");
  const savedFormData = savedFormDataString
    ? JSON.parse(savedFormDataString)
    : [];

  const savedComponents = localStorage.getItem("components");
  const savedComponentsData = savedComponents
    ? JSON.parse(savedComponents)
    : [];
  const [loadedData, setLoadedData] = useState(savedFormData);
  const [components, setComponents] = useState(savedComponentsData);

  useEffect(() => {
    setLoadedData(savedFormData);
    setComponents(savedComponentsData);
  },[]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${BASE_API_URL}/dynamic-component/generate-thumbnail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      // Parse the response JSON
      const responseData = await response.json();

      // Extract image URLs from the response
      const urls = responseData.data.map((image: { url: string }) => image.url);

      setImageUrls(urls);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const saveClick = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/dynamic-component/new`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: loadedData[0].title,
          description: loadedData[0].description,
          image_url: loadedData[0].image,
          component_definition: components,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      localStorage.removeItem("formData");
      localStorage.removeItem("components");
      setPopup(true);
      setTimeout(() => {
        setPopup(false);
        // redirect("/");
        window.location.href = "/";
      }, 5000);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const goBack = () => {
    window.location.href = "/app/new";
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:mt-8 lg:p-6 lg:mx-20 xl:mt-16 xl:mx-40 lg:p- xl:p-12">
      <div>
        <h1>DALL-E 3 Image Generator</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            name="prompt"
            placeholder="Describe an image..."
            defaultValue={lastPrompt}
            style={{ width: "100%", display: "block", marginBottom: "10px" }}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <button className="common-button px-4 py-2 text-white font-semibold bg-orange-500 rounded-md focus:bg-orange-600 focus:outline-none hover:bg-orange-600 hover:shadow-lg transition duration-300" type="submit">Generate Image</button>
        </form>
        <div>
          <button
            className="common-button px-4 py-2 text-white font-semibold bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none hover:bg-blue-600 hover:shadow-lg transition duration-300"
            onClick={goBack}
          >
            <span className="absolute text-hover text-white font-medium mt-10 -ml-10 mr-2 md:mr-10 lg:-ml-20 px-2 bg-slate-500 p-1 rounded-md z-50">
              Return to edit the app
            </span>
            Back
          </button>
        </div>
        {/* <div className="flex justify-end">
          <button
            className="p-3 px-5 font-bold text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700"
            onClick={saveClick}
          >
            Save
          </button>
        </div> */}
        {error && <p>{error}</p>}
        {imageUrls &&
          imageUrls.map((url, index) => (
            <img
              className="w-96 h-96 m-10"
              key={index}
              src={url}
              alt={`Generated Image ${index}`}
            />
          ))}
        {!imageUrls && <p>Enter a prompt to generate your first image!</p>}
      </div>

      {popup && (
        <div className="popupThanks flex flex-col justify-center items-center -ml-[1rem] md:-ml-[2.5rem] lg:-ml-[6.5rem] xl:-ml-[13rem] fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
          <div className="bg-white rounded-md font-serif p-1 py-8 md:p-2 md:w-[25rem] md:h-[20rem] lg:w-[30rem] xl:p-4 flex flex-col justify-center items-center">
            <img
              src={flower}
              alt="flowers"
              className="w-[3rem] md:w-[5rem]"
            ></img>
            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Congratulations!
            </p>
            <p className="lg:text-lg xl:text-xl text-[#85909B] text-center">
              Fantastic work! Your app has been created and submitted for
              review.
            </p>
            <p className="md:mt-2 text-green-600 text-lg lg:text-xl text-center">
              Keep innovating and sharing your creativity!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigureThumbnail;

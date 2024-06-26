import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "~/components/constants";
import flower from "../../photos/flower.png";
import { Link } from "react-router-dom";
import arrow from "../../photos/angle-right-solid.svg";
import pin from "../../photos/paperclip-solid.svg";
import { redirect } from "react-router-dom";
import "./ConfigureThumbnail.css";
import Loading from "./loadingPage/Loading";

interface FrontendProps {
  lastPrompt?: string;
}

const ConfigureThumbnail: React.FC<FrontendProps> = ({ lastPrompt }) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [popup, setPopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

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
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
        setImageName(file.name);
        setSelectedImageUrl("");
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const promptValue =
        prompt || `${loadedData.title} - ${loadedData.description}`;

      const response = await fetch(
        `${BASE_API_URL}/dynamic-component/generate-thumbnail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: promptValue }),
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
    } finally {
      setLoading(false);
    }
  };

  const preferredImageURL = selectedImageUrl || uploadedImage;
  console.log("Selected preferredImageURL:", preferredImageURL);
  console.log("Size of preferredImageURL:", preferredImageURL.length, "bytes");

  const saveClick = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/dynamic-component/new`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: loadedData.title,
          description: loadedData.description,
          image_url: preferredImageURL, //selected image url
          component_definition: JSON.stringify(components),
          privacy: loadedData.privacy,
          teamId: loadedData.privacy === "private" ? loadedData.teamId : null,
          selectedContracts: loadedData.selectedContracts,
          networkDetails: loadedData.networkDetails,
          contractDetails: loadedData.contractDetails,
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
    window.location.href = "/app/new/preview";
  };

  console.log(loadedData)

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12">
        <div className="p-1 md:p-4 bg-gray-100 rounded">
        <div className="relative flex overflow-auto gap-5 md:gap-8 lg:gap-5 xl:gap-2 border-b pb-5 items-center">
            <Link to="/app/inbuilt/New-App" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] lg:w-[9rem] xl:w-[12.5rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/contract" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                  2
                </span>
                Configure Visibility
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[11rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/field" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                  3
                </span>
                Configure layout
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[10.5rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/preview" className="group">
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                4
              </span>
              Preview the app
              <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[10.5rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
            </p>
            </Link>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                5
              </span>
              Publish the app
              <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] xl:w-[10rem] bg-[#31A05D]"></span>
            </p>
          </div>

          <div className="flex justify-between my-5">
            <h1 className="md:text-2xl font-bold">
              Customize Thumbnail for Your {loadedData.title} App
            </h1>

            <button
              className="common-button px-4 py-2 text-white font-semibold bg-blue-500 rounded-md focus:bg-blue-600 focus:outline-none hover:bg-blue-600 hover:shadow-lg transition duration-300"
              onClick={goBack}
            >
              <span className="absolute text-hover text-white font-medium mt-10 -ml-10 mr-2 md:mr-10 lg:-ml-20 px-2 bg-slate-500 p-1 rounded-md z-50">
                Return to preview
              </span>
              Back
            </button>
          </div>

          <div
            id="animatedDiv"
            className="md:flex p-2 md:text-sm bg-gradient-to-r from-blue-300 to-blue-200 text-blue-800 my-5 rounded-md text-center justify-center items-center shadow-lg"
          >
            <div className="overflow-hidden whitespace-no-wrap">
              <p id="scrollText" className="inline-block">
                Upload an image from your local computer or
                generate one using AI by describing the image in the text area below.
              </p>
            </div>
          </div>

          <p className="text-left py-3 text-[#727679] justify-between md:text-lg">
              <span className="text-blue font-bold">Upload Thumbnail :</span>
          </p>

          <div className="flex justify-between">
            <div className="flex md:gap-5 text-center">
              <p className="file-upload flex justify-center p-2 md:p-3 rounded-md gap-0.5 md:gap-3 xl:text-lg cursor-pointer">
                <img
                  src={pin}
                  alt="pin"
                  className="object-scale-down self-center lg:w-6 lg:h-7"
                ></img>
                <span className="text-[#2E4055] font-medium self-center ">
                  Select image
                </span>
                <input
                  type="file"
                  className="w-40"
                  onChange={handleImageUpload}
                ></input>
              </p>
            </div>
          </div>

          {uploadedImage && (
            <div className="flex justify-center mt-3 md:mt-5">
              <img
                className="w-full md:w-48 h-auto justify-center items-center bg-white rounded-lg overflow-hidden p-4 shadow-md hover:shadow-lg"
                src={uploadedImage}
                alt="Uploaded Image"
                onClick={() => setSelectedImageUrl("")}
              />
            </div>
          )}

          <p className="text-center py-3 text-[#727679] self-center md:text-lg">
            {imageName ? (
              <span>{imageName}</span>
            ) : (
              <span className="text-gray-400">No thumbnail yet.</span>
            )}
          </p>

          <p className="text-left py-3 text-[#727679] justify-between md:text-lg">
              <span className="text-black font-bold text-xl">OR</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label
              htmlFor="image-description"
              className="py-2 text-[#727679] justify-between md:text-lg font-bold"
            >
              Generate thumbnail using AI:
            </label>
            <textarea
              id="image-description"
              className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C]"
              name="prompt"
              placeholder="Describe an image..."
              defaultValue={`${loadedData.title} - ${loadedData.description}`}
              // defaultValue={lastPrompt}
              style={{ width: "100%", display: "block", marginBottom: "10px" }}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <button
              className="mx-auto px-4 py-2 text-white font-semibold bg-orange-500 rounded-md focus:bg-orange-600 focus:outline-none hover:bg-orange-600 hover:shadow-lg transition duration-300"
              type="submit"
            >
              Generate Image
            </button>
          </form>

          <div className="flex flex-col md:flex-row gap-5 mt-5 justify-center">
            {error && <p>{error}</p>}
            {imageUrls &&
              imageUrls.map((url, index) => (
                <img
                  className="w-full h-48 justify-center items-center bg-white rounded-lg overflow-hidden p-4 shadow-md hover:shadow-lg"
                  key={index}
                  src={url}
                  alt={`Generated Image ${index}`}
                  onClick={() => setSelectedImageUrl(url)}
                />
              ))}
            {!imageUrls && (
              <p className="text-center">
                Enter a prompt to generate your first image!
              </p>
            )}
          </div>

          <div className="flex justify-end mt-5">
            <button
              className="p-3 px-5 font-bold text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700"
              onClick={saveClick}
            >
              Save
            </button>
          </div>

          {preferredImageURL && (
            <div className="mt-5">
              <h1 className="text-lg font-semibold text-gray-800 mb-2">
                Selected image
              </h1>
              <img
                className="mx-auto w-full md:w-64 md:h-60 justify-center items-center bg-yellow-200 rounded-lg overflow-hidden p-4 shadow-md  border border-gray-300 hover:shadow-lg"
                src={preferredImageURL}
                alt="Selected Image"
              />
            </div>
          )}
        </div>

        {loading && <Loading />}
        
        {popup && (
          <div className="popupThanks flex flex-col justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
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
    </>
  );
};

export default ConfigureThumbnail;

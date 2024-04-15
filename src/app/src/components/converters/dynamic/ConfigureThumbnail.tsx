import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "~/components/constants";
import flower from "../../photos/flower.png";
import { Link } from "react-router-dom";
import arrow from "../../photos/angle-right-solid.svg";
import pin from "../../photos/paperclip-solid.svg";
import { redirect } from "react-router-dom";

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
  // console.log(image);
  // console.log(imageUrls);
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
        setSelectedImageUrl(""); // Clear selected image URL when uploading new image
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const promptValue =
        prompt || `${loadedData[0].title} - ${loadedData[0].description}`;

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
    }
  };

  const preferredImageURL = selectedImageUrl || uploadedImage;
  console.log(preferredImageURL);

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
          image_url: preferredImageURL, //selected image url
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
    window.location.href = "/app/new/preview";
  };

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12">
        <div className="p-1 md:p-4 bg-gray-100 rounded">
          <div className="relative flex overflow-auto gap-8 border-b pb-5 items-center">
            <Link to="/app/inbuilt/New-App" className="group">
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3.5 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[8rem] lg:w-[11rem] xl:w-[15rem] bg-[#31A05D]  opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new" className="group">
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3.5 rounded-full font-bold">
                  2
                </span>
                Configure inputs / outputs
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[8rem] md:w-[9rem] lg:w-[12rem] xl:w-[16rem] 2xl:w-[17rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <Link to="/app/new/preview" className="group">
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3.5 rounded-full font-bold">
                  3
                </span>
                Preview Mode
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] md:w-[7.2rem] lg:w-[7.5rem] xl:w-[10rem] 2xl:w-[11rem] bg-[#31A05D] opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
              <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3.5 rounded-full font-bold">
                4
              </span>
              Upload Thumbnail
              <span className="absolute bottom-0 ml-1 h-[2px] w-[7.5rem] lg:w-[8.5rem] xl:w-[10rem] 2xl:w-[13rem] bg-[#31A05D]"></span>
            </p>
          </div>

          <div className="flex justify-between my-5">
            <h1 className="md:text-2xl font-bold">
              Customize Thumbnail for Your {loadedData[0].title} App
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

          <div className="flex justify-between">
            <div className="flex md:gap-5 text-center">
              <p className="file-upload flex justify-center p-2 md:p-3 rounded-md gap-0.5 md:gap-3 xl:text-lg cursor-pointer">
                <img
                  src={pin}
                  alt="pin"
                  className="object-scale-down self-center lg:w-6 lg:h-7"
                ></img>
                <span className="text-[#2E4055] font-medium self-center ">
                  App Thumbnail
                </span>
                <input
                  type="file"
                  className="w-40"
                  onChange={handleImageUpload}
                ></input>
              </p>
              <p className="text-[#727679] text-center self-center md:text-lg">
                Choose Thumbnail
              </p>
            </div>

            {/* <p className="hidden md:block text-[#727679] self-center md:text-lg">
              {imageName && <span>{imageName}</span>}
            </p> */}
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

          <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
              className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C]"
              name="prompt"
              placeholder="Describe an image..."
              defaultValue={`${loadedData[0].title} - ${loadedData[0].description}`}
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
              // onClick={saveClick}
            >
              Save
            </button>
          </div>

          {preferredImageURL && (
            <div className="mt-5">
              <h1 className="text-lg font-semibold text-gray-800 mb-2">selected image</h1>
              <img className="mx-auto h-48 justify-center items-center bg-white rounded-lg overflow-hidden p-4 shadow-md hover:shadow-lg" src={preferredImageURL} alt="Selected Image" />
            </div>
          )}
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
    </>
  );
};

export default ConfigureThumbnail;

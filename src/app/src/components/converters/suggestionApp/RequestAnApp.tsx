import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL } from "~/components/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GITHUB_CLIENT_ID } from "~/components/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";

interface Request {
  id: string;
  title: string;
  description: string;
  created_on: string;
  creator: string;
}

const RequestAnApp: React.FC = () => {
  const [shortSummary, setShortSummary] = useState<string>("");
  const [detailedDescription, setDetailedDescription] = useState<string>("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedActions, setSelectedActions] = useState<{
    [key: string]: string;
  }>({});
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [userDetails, setUserDetails] = useState<string | null>(null);

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    console.log(userDetails);
    setUserDetails(userDetails);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/dynamic-component/suggestion-list`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!shortSummary.trim()) {
      toast.error("Short Summary cannot be empty.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_API_URL}/dynamic-component/suggest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: shortSummary,
            description: detailedDescription,
          }),
        }
      );

      if (response.ok) {
        toast.success("Request submitted", { position: "top-center" });
        fetchRequests(); // Refresh the list of requests
        setShortSummary("");
        setDetailedDescription("");
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to submit request: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleSummaryClick = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      descriptionRef.current &&
      !descriptionRef.current.contains(e.target as Node)
    ) {
      setSelectedRequest(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (action: string, requestId: number) => {
    setSelectedActions((prevState) => ({
      ...prevState,
      [requestId]: action,
    }));
    console.log(`${action} clicked for request ${requestId}`);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 md:p-10 xl:p-12 shadow-lg rounded-md whitespace-normal break-words">
      <div className="p-1 md:p-4 flex flex-col gap-5 bg-gray-100 rounded">
        {userDetails != null ? (
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="shortSummary"
                  className="text-[#555758] font-semibold text-lg xl:text-xl"
                >
                  Short Summary:
                </label>
                <br />
                <textarea
                  id="shortSummary"
                  className="description w-full focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C]  placeholder:italic"
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  placeholder="Short summary"
                  // required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="detailedDescription"
                  className="text-[#555758] font-semibold text-lg xl:text-xl"
                >
                  Detailed Description:
                </label>
                <br />
                <textarea
                  id="detailedDescription"
                  className="description w-full focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C]  placeholder:italic"
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Detailed description (optional)"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* <h2>Requests by Other Users</h2> */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center mt-2 md:text-left">
              Explore User Requests
            </h2>
            <div className="overflow-x-auto rounded">
              <table className="min-w-full">
                <thead className="border-b-2 border-slate-300 bg-gray-50 text-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 font-medium tracking-wider uppercase"
                      // border-r border-slate-300
                    >
                      Requests by Other Users
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-medium tracking-wider uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request, index) => (
                    <tr key={index} className="odd:bg-white even:bg-slate-200">
                      <td
                        className="px-3 py-2 lg:p-3 md:text-lg font-serif cursor-pointer max-w-xs md:max-w-xl lg:max-w-2xl overflow-auto hover:bg-purple-300"
                        onClick={() => handleSummaryClick(request)}
                      >
                        <div className="flex justify-between items-center group/item  relative">
                          <p>{request.title}</p>
                          <p
                            className="group/edit invisible hover:scale-110 group-hover/item:visible absolute right-0 top-0 bottom-0 md:px-2 flex items-center group-hover/edit:text-orange-600 text-orange-600 hover:text-orange-500"
                            title="Expand Description"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              className="h-5 w-5"
                              fill="currentColor"
                            >
                              <path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                            </svg>
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-right text-sm font-medium flex gap-3 lg:gap-5 justify-between">
                        <button
                          className="transition-colors duration-300 ease-in-out hover:scale-125"
                          onClick={() => handleActionClick("thumbsUp", index)}
                          disabled={selectedActions[index] === "thumbsUp"}
                        >
                          <FontAwesomeIcon
                            icon={
                              selectedActions[index] === "thumbsUp"
                                ? faThumbsUp
                                : (farThumbsUp as IconProp)
                            }
                            color={
                              selectedActions[index] === "thumbsUp"
                                ? "blue"
                                : "orange"
                            }
                            size={
                              selectedActions[index] === "thumbsUp"
                                ? "lg"
                                : undefined
                            }
                          />
                        </button>
                        <button
                          className="transition-colors duration-300 ease-in-out hover:scale-125"
                          onClick={() => handleActionClick("thumbsDown", index)}
                          disabled={selectedActions[index] === "thumbsDown"}
                        >
                          <FontAwesomeIcon
                            icon={
                              selectedActions[index] === "thumbsDown"
                                ? faThumbsDown
                                : (farThumbsDown as IconProp)
                            }
                            color={
                              selectedActions[index] === "thumbsDown"
                                ? "red"
                                : "orange"
                            }
                            size={
                              selectedActions[index] === "thumbsDown"
                                ? "lg"
                                : undefined
                            }
                          />
                        </button>
                        <button
                          className="transition-colors duration-300 ease-in-out hover:scale-125"
                          onClick={() => handleActionClick("heart", index)}
                          disabled={selectedActions[index] === "heart"}
                        >
                          <FontAwesomeIcon
                            icon={
                              selectedActions[index] === "heart"
                                ? faHeart
                                : (farHeart as IconProp)
                            }
                            color={
                              selectedActions[index] === "heart"
                                ? "#EC4899"
                                : "orange"
                            }
                            size={
                              selectedActions[index] === "heart"
                                ? "lg"
                                : undefined
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div
                  ref={descriptionRef}
                  className="bg-white border border-gray-300 rounded-md max-w-md lg:max-w-xl max-h-[60%] overflow-auto shadow-lg"
                >
                  <h3 className="text-lg p-2 px-4 lg:text-xl font-semibold text-center text-gray-900 border-b border-gray-300">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-center p-4">
                    {selectedRequest.description ? (
                      selectedRequest.description
                    ) : (
                      <span className="animate-pulse font-semibold text-red-500">
                        No description available
                      </span>
                    )}
                  </p>
                  <button
                    className="absolute top-0 right-0 m-2 text-gray-800 hover:text-gray-700 focus:outline-none"
                    onClick={() => setSelectedRequest(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <ToastContainer />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5">
            <p className="text-[#727679] mb-4">
              You need to log in to create custom apps.
            </p>
            <a
              href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
              className="mx-auto md:mx-0"
            >
              <button
                className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                type="submit"
              >
                Login with GitHub
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAnApp;

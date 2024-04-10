import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL } from "~/components/constants";
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
  console.log(requests);

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
        console.log("Request submitted");
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
                  required
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
            <div className="overflow-x-auto mt-6 rounded">
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
                        className="px-3 py-2 lg:p-3 md:text-lg font-serif cursor-pointer max-w-xs md:max-w-xl lg:max-w-2xl overflow-auto"
                        // border-r border-slate-300
                        onClick={() => handleSummaryClick(request)}
                      >
                        {request.title}
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
                  className="bg-white border border-gray-300 rounded-md max-w-md lg:max-w-xl max-h-[60%] overflow-auto"
                >
                  <h3 className="text-lg p-2 px-4 lg:text-xl font-semibold text-center underline underline-offset-2 ">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-center px-2">
                    {selectedRequest.description ? (
                      selectedRequest.description
                    ) : (
                      <span className="animate-pulse font-semibold text-red-500">
                        No description available
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
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

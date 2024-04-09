import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL } from "~/components/constants";

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
  const descriptionRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 md:p-10 xl:p-12 shadow-lg rounded-md whitespace-normal break-words">
      <div className="p-1 md:p-4 flex flex-col gap-5 bg-gray-100">
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
        <h2>Requests by Other Users</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium  tracking-wider">
                SUMMARY
              </th>
              <th scope="col" className="px-6 py-3 font-medium  tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleSummaryClick(request)}
                >
                  {request.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Thumbs Up
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Thumbs Down
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Heart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div
              ref={descriptionRef}
              className="bg-white p-4 mt-4 border border-gray-300 rounded-md md:p-8 w-full max-w-md"
            >
              <h3 className="text-lg lg:text-xl font-semibold mb-2 text-center underline underline-offset-2">
                {selectedRequest.title}
              </h3>
              <p className="text-center">{selectedRequest.description ? selectedRequest.description : <span className="animate-pulse font-semibold text-red-500">No description available</span>}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestAnApp;

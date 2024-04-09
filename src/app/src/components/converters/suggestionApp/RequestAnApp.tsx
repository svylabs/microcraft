import React, { useState, useEffect } from "react";
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
  console.log(requests);
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
            credentials: "include",
          },
          // credentials: "include",
          body: JSON.stringify({
            title: shortSummary,
            description: detailedDescription,
            // created_on: "09-04-2024",
            // creator: "rohit",
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

  return (
    <div>
      <h1>Request an App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="shortSummary">Short Summary:</label>
          <textarea
            id="shortSummary"
            className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] resize-none placeholder:italic"
            value={shortSummary}
            onChange={(e) => setShortSummary(e.target.value)}
            placeholder="Short summary"
            rows={5}
            cols={50}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="detailedDescription">Detailed Description:</label>
          <textarea
            id="detailedDescription"
            className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] resize-none placeholder:italic"
            value={detailedDescription}
            onChange={(e) => setDetailedDescription(e.target.value)}
            placeholder="Detailed description"
            rows={5}
            cols={50}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      <h2>Requests by Other Users</h2>
      <table>
        <thead>
          <tr>
            <th>Summary</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.title}</td>
              <td>{request.description}</td>
              <td>
                <button>Thumbs Up</button>
                <button>Thumbs Down</button>
                <button>Heart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestAnApp;

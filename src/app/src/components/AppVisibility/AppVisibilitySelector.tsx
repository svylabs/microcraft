import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_API_URL } from "../constants";
import copyClipboard from "../photos/copy-svgrepo-com.svg";

const AppVisibilitySelector = ({ setShowTeams }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [privateContractGroups, setPrivateContractGroups] = useState<any[]>([]);
  const [publicContractGroups, setPublicContractGroups] = useState<any[]>([]);
  const [showApiKeySection, setShowApiKeySection] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [apiKeysList, setApiKeysList] = useState<any[]>([]);
  const [popupGeneratedApiKey, setPopupGeneratedApiKey] = useState(false);
  const [popupExistingApiKey, setPopupExistingApiKey] = useState(false);
  const [copiedApiKeyId, setCopiedApiKeyId] = useState(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeams();
    fetchApiKeys();

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowTeams(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Set default selected team if there are teams available
    if (teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  useEffect(() => {
    if (selectedTeamId) {
      fetchPrivateContractGroups(selectedTeamId);
      fetchPublicContractGroups();
    }
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/teams/list`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const teamsData = await response.json();
        setTeams(teamsData);
      } else {
        console.error("Failed to fetch teams:", response.status);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (teamName.trim() === "" || teamDescription.trim() === "") {
      toast.error("Team name and description cannot be empty");
      return;
    }

    if (
      teams.some(
        (team) =>
          team.name.trim().toLowerCase() === teamName.trim().toLowerCase()
      )
    ) {
      toast.error("Team name must be unique");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/teams/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: teamName,
          description: teamDescription,
        }),
      });
      if (response.ok) {
        const newTeam = await response.json();
        console.log("Team created successfully:", newTeam);
        setTeamName("");
        setTeamDescription("");
        fetchTeams(); // Fetch updated teams
        toast.success("Team created successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Failed to create team:", response.status);
        toast.error("Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Error creating team");
    }
  };

  const handleAddUserToTeam = async () => {
    if (!selectedTeamId || userEmail.trim() === "") {
      toast.error("Please select a team and enter a valid email");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/teams/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          teamId: selectedTeamId,
          email: userEmail,
        }),
      });
      if (response.ok) {
        const updatedUsers = await response.json();
        console.log("User added to team successfully:", updatedUsers);
        setUserEmail("");
        toast.success("User added to team successfully!");
      } else {
        console.error("Failed to add user to team:", response.status);
        toast.error("Failed to add user to team");
      }
    } catch (error) {
      console.error("Error adding user to team:", error);
      toast.error("Error adding user to team");
    }
  };

  const handleChange = (e) => {
    const email = e.target.value;
    setUserEmail(email);

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsValid(emailRegex.test(email));
  };

  const fetchPrivateContractGroups = async (teamId: string) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/contract-registry/group/list?owner=${teamId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const contractGroupsData = await response.json();
        console.log(contractGroupsData);
        setPrivateContractGroups(contractGroupsData);
      } else {
        console.error("Failed to fetch contract groups:", response.status);
        setPrivateContractGroups([]);
      }
    } catch (error) {
      console.error("Error fetching contract groups:", error);
    }
  };

  const fetchPublicContractGroups = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/contract-registry/group/list?owner=public`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const contractGroupsData = await response.json();
        console.log(contractGroupsData);
        setPublicContractGroups(contractGroupsData);
      } else {
        console.error(
          "Failed to fetch public contract groups:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching public contract groups:", error);
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/api-key/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const apiKeyData = await response.json();
        console.log(apiKeyData);
        setGeneratedApiKey(apiKeyData.api_key);
        toast.success("API Key generated successfully!");
      } else {
        console.error("Failed to generate API Key:", response.status);
        toast.error("Failed to generate API Key");
      }
    } catch (error) {
      console.error("Error generating API Key:", error);
      toast.error("Error generating API Key");
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/auth/api-key/list`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const apiKeyList = await response.json();
        console.log(apiKeyList);
        setApiKeysList(apiKeyList);
      } else {
        console.error(
          "Failed to fetch API keys::",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  const copyToClipboard = (apiKey, setPopup, apiKeyId = null) => {
    navigator.clipboard.writeText(apiKey);
    setPopup(true);
    if (apiKeyId !== null) {
      setCopiedApiKeyId(apiKeyId);
    }
    setTimeout(() => {
      setPopup(false);
      setCopiedApiKeyId(null);
    }, 15000);
  };

  // console.log(apiKeysList);
  // console.log(typeof apiKeysList);
  // console.log(privateContractGroups);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-md p-4 md:p-8 w-full max-w-md relative py-10"
      >
        <span
          className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-300 text-2xl rounded-full pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-500 hover:text-white hover:scale-110"
          onClick={() => setShowTeams(false)}
        >
          &times;
        </span>

        <div className={showApiKeySection ? "hidden" : ""}>  {/* h-[74vh] overflow-auto */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowApiKeySection(true)}
              className="cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md xl:text-lg p-1 px-2 mr-7 md:mr-1 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Manage API Keys
            </button>
          </div>
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-lg font-bold">Create a New Team</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="p-2 border rounded focus:outline-none"
            />
            <textarea
              placeholder="Team Description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              className="bg-white border border-gray-300 p-2 rounded w-full"
            />
            <button
              onClick={handleCreateTeam}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md xl:text-lg py-1.5 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Team
            </button>
          </div>

          <div className="flex flex-col gap-1 text-left mt-2">
            <h3 className="text-lg font-bold">Your Teams</h3>
            <select
              // key={Math.random()}
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] placeholder:italic w-full"
            >
              {teams.length === 0 ? (
                <option key="no-team" value="">
                  No teams found. Add a team!
                </option>
              ) : (
                teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {/* {console.log(team)}
                    {console.log(team.id)} */}
                    {team.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left mt-2">
            <h3 className="text-lg font-bold">Add User to Team</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={handleChange}
              className={`p-2 border rounded focus:outline-none ${isValid ? "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent" : "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"}`}
            />
            <button
              onClick={handleAddUserToTeam}
              className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md xl:text-lg py-1.5 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-1"
            >
              Add User to Team
            </button>
          </div>

          <div className="flex flex-col text-left mt-2">
            <h3 className="text-lg font-bold">Contract Groups List</h3>
            <span className="text-[#c055ce] text-sm text-center">
              Please select a team to view contract groups.
            </span>
            <div className="mt-1">
              <label className="text-[#727679] font-semibold">
                Private Contract Groups:
              </label>
              <select
                id="contract-groups"
                className="focus:outline-none border border-[#E2E3E8] rounded p-2 mb-2 bg-[#F7F8FB] placeholder:italic w-full"
              >
                {privateContractGroups.length === 0 ? (
                  <option key="no-group" value="">
                    No contract groups found for the selected team.
                  </option>
                ) : (
                  privateContractGroups.map((group, index) => (
                    <option
                      key={`${group.owner}-${index}`}
                      value={`${group.owner}-${group.name}`}
                    >
                      {group.name}
                    </option>
                  ))
                )}
              </select>

              <label className="text-[#727679] font-semibold">
                Public Contract Groups:
              </label>
              <select
                id="contract-groups"
                className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] placeholder:italic w-full"
              >
                {publicContractGroups.length === 0 ? (
                  <option key="no-group" value="">
                    No contract groups found for the selected team.
                  </option>
                ) : (
                  publicContractGroups.map((group, index) => (
                    <option
                      key={`${group.owner}-${index}`}
                      value={`${group.owner}-${group.name}`}
                    >
                      {group.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
        {showApiKeySection && (
          <div className={`p-3 px-4 bg-gray-200 rounded shadow-lg max-w-xl mx-auto mt-2 ${!showApiKeySection ? "hidden" : ""}`}>
            <h3 className="text-lg md:text-xl font-bold text-center text-[#4a4b4c] underline underline-offset-2">API Key Management</h3>
            <div className="mt-2 relative">
              <input
                type="text"
                value={generatedApiKey}
                readOnly
                placeholder="Your API Key will appear here"
                className="p-3 border rounded focus:outline-none bg-gray-100 w-full shadow-md"
              />
              <span className="absolute right-0 top-0 mt-3 mr-3 cursor-copy bg-slate-700 rounded" onClick={() => copyToClipboard(generatedApiKey, setPopupGeneratedApiKey)} title="Copy API Key">
                <img src={copyClipboard} alt="copyClipboard" className="p-1" />
              </span>
              {popupGeneratedApiKey && generatedApiKey && (
                <div className="absolute -right-4 md:right-0 -top-6 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                  copied!
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={generateApiKey}
                className="bg-[#449293] text-white rounded-md text-lg py-1.5 px-6 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                title="Click to Generate API Key"
              >
                Generate API Key
              </button>
            </div>
            <div className="bg-gray-100 p-3 rounded-md shadow-md max-w-lg mx-auto mt-4 relative">
              <h2 className="text-[#727679] font-semibold text-lg text-cente mb-2">Existing API Keys</h2>
              {apiKeysList.length > 0 ? (
                <ul className="space-y-2 h-36 overflow-auto">
                  {apiKeysList.map(apiKey => (
                    <li key={apiKey.id} className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm border border-gray-200 relative">
                      <span className="flex-1 truncate">{apiKey.api_key}</span>
                      <img
                        src={copyClipboard}
                        alt="Copy to Clipboard"
                        className="cursor-copy p-1 bg-slate-700"
                        onClick={() => copyToClipboard(apiKey.api_key, setPopupExistingApiKey, apiKey.id)}
                        title="Copy API Key"
                      />
                      {copiedApiKeyId === apiKey.id && (
                        <div className="absolute right-10 md:right top-[0.8rem] text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                          copied!
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No API keys found.</p>
              )}
            </div>
            <div className="flex items-center mt-4 cursor-pointer" title="Back to Teams">

              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 128 128" onClick={() => setShowApiKeySection(false)} className="xl:text-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"><path fill="#427687" d="M116 4H12c-4.4 0-8 3.6-8 8v104c0 4.4 3.6 8 8 8h104c4.4 0 8-3.6 8-8V12c0-4.4-3.6-8-8-8" /><path fill="#8cafbf" d="M109.7 4H11.5C7.4 4 4 7.4 4 11.5v97.9c0 4.2 3.4 7.5 7.5 7.5h98.1c4.2 0 7.5-3.4 7.5-7.5V11.5c.2-4.1-3.3-7.5-7.4-7.5" /><path fill="#b4e1ed" d="M39.7 12.9c0-2.3-1.6-3-10.8-2.7c-7.7.3-11.5 1.2-13.8 4s-2.9 8.5-3 15.3c0 4.8 0 9.3 2.5 9.3c3.4 0 3.4-7.9 6.2-12.3c5.4-8.7 18.9-10.6 18.9-13.6" opacity="0.5" /><path fill="#fafafa" d="m47.4 71l-24-24c-1.8-1.6-1.8-4.4 0-6l24-24c2.6-2.3 6.6-.4 6.6 3v14c0 1.1.9 2 2 2h46c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H56c-1.1 0-2 .9-2 2v14c0 3.4-4 5.3-6.6 3M14 110.9V85.4c0-.6.5-1 1-1h8.4c3.1 0 5.5.6 7.1 1.9c1.6 1.2 2.4 3.1 2.4 5.6c0 1.3-.3 2.4-1 3.4s-1.7 1.8-3 2.3c1.5.4 2.6 1.2 3.4 2.3c.8 1.1 1.2 2.4 1.2 4c0 2.6-.8 4.6-2.5 6s-4 2.1-7.1 2.1h-9c-.5-.1-.9-.5-.9-1.1M18.8 95c0 .6.5 1 1 1h3.7c1.5 0 2.6-.3 3.5-1s1.3-1.6 1.3-2.9c0-1.4-.4-2.3-1.2-2.9s-2-.9-3.6-.9h-3.6c-.6 0-1 .4-1 1zm0 5.5v6.6c0 .6.5 1 1 1h4.3c1.5 0 2.7-.4 3.5-1.1s1.3-1.8 1.3-3.1c0-2.8-1.5-4.3-4.4-4.4h-4.7c-.6 0-1 .4-1 1m34.3 5h-9.2c-.4 0-.8.3-1 .7l-1.8 5.1c-.1.4-.5.7-1 .7h-2.8c-.7 0-1.2-.7-.9-1.4L46.1 85c.2-.4.5-.7.9-.7h3c.4 0 .8.3.9.7l9.6 25.5c.2.7-.2 1.4-.9 1.4h-2.8c-.4 0-.8-.3-1-.7l-1.8-5.1c-.1-.3-.5-.6-.9-.6m-7.2-3.9H51c.7 0 1.2-.7 1-1.3L49.5 93c-.3-.9-1.6-.9-1.9 0l-2.6 7.3c-.3.7.2 1.3.9 1.3m37.7 1.3c.6 0 1.1.6 1 1.2c-.4 2.4-1.5 4.2-3.1 5.7c-1.9 1.7-4.4 2.5-7.5 2.5c-2.2 0-4.1-.5-5.8-1.6s-3-2.5-3.9-4.4s-1.4-4.1-1.4-6.7V97c0-2.6.5-4.9 1.4-6.9s2.2-3.5 4-4.6c1.7-1.1 3.7-1.6 6-1.6c3 0 5.5.8 7.3 2.5c1.6 1.4 2.6 3.3 3.1 5.8c.1.6-.4 1.2-1 1.2H81c-.5 0-.9-.3-1-.8c-.3-1.6-.8-2.7-1.6-3.5c-.9-.9-2.3-1.3-4.1-1.3c-2.1 0-3.7.8-4.8 2.3c-1.1 1.5-1.7 3.8-1.7 6.7v2.4c0 3 .5 5.2 1.6 6.8c1.1 1.6 2.6 2.3 4.7 2.3c1.9 0 3.3-.4 4.2-1.3c.8-.7 1.4-1.9 1.7-3.4c.1-.5.5-.8 1-.8c-.1.1 2.6.1 2.6.1m12.5-2l-2 2.1c-.2.2-.3.4-.3.7v7.2c0 .6-.4 1-1 1H90c-.6 0-1-.4-1-1V85.4c0-.6.4-1 1-1h2.8c.6 0 1 .4 1 1v9.1c0 .9 1.2 1.4 1.8.6l.8-1.1l7.8-9.3c.2-.2.5-.4.8-.4h3.2c.9 0 1.3 1 .8 1.7l-8.3 9.9c-.3.3-.3.9-.1 1.2l9.2 13.1a1 1 0 0 1-.8 1.6h-3.2c-.3 0-.6-.2-.8-.4L97.7 101c-.4-.5-1.1-.5-1.6-.1" /></svg>

            </div>
          </div>
        )}
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AppVisibilitySelector;

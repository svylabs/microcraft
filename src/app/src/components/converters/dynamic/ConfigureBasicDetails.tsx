import React, { useState, useEffect, useRef } from "react";
import "./ConfigureBasicDetails.scss";
import arrow from "../../photos/angle-right-solid.svg";
import { Link } from "react-router-dom";
import { GITHUB_CLIENT_ID, BASE_API_URL } from "~/components/constants";
import AppVisibilitySelector from "../../AppVisibility/AppVisibilitySelector";

interface Team {
  id: string;
  name: string;
}

interface ContractGroup {
  id: string;
  name: string;
}

const ConfigureBasicDetails: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    privacy: false,
  });
  const [userDetails, setUserDetails] = useState<string | null>(null);
  const [showTeams, setShowTeams] = useState(false);
  const [contractGroups, setContractGroups] = useState<ContractGroup[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [contractGroupsFetched, setContractGroupsFetched] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    console.log(userDetails);
    setUserDetails(userDetails);
    const existingData = localStorage.getItem("formData");
    if (existingData) {
      const formData = JSON.parse(existingData);
      setTitle(formData.title || "");
      setDescription(formData.description || "");
    }
  }, []);

  useEffect(() => {
    if (privacy === "private") {
      fetchTeams();
    }
  }, [privacy]);

  useEffect(() => {
    if (teamId) {
      fetchContractGroups();
    }
  }, [teamId]);

  const fetchTeams = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}/teams/list`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Response status:", response.status);
        if (response.ok) {
            const teams: Team[] = await response.json();
            console.log(teams);
            if (teams.length === 0) {
                setShowTeams(true);
            } else {
                setTeams(teams);
            }
        } else {
            console.error("Failed to fetch teams list:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching teams list:", error);
    }
};

const fetchContractGroups = async () => {
  setContractGroupsFetched(false);
  try {
    const response = await fetch(`${BASE_API_URL}/contract-registry/group/list?owner=${teamId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const contractGroups: ContractGroup[] = await response.json();
      setContractGroups(contractGroups);
    } else {
      console.error("Failed to fetch contract groups:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching contract groups:", error);
  }
  setContractGroupsFetched(true);
};

  const handleSaveNext = () => {
    if (!title.trim()) {
      setFieldErrors({ ...fieldErrors, title: !title.trim() });
      return;
    }
    if (privacy === "private" && !teamId) {
      setFieldErrors({ ...fieldErrors, privacy: true });
      return;
    } else {
      localStorage.removeItem("formData");
      const data = { title, description, privacy, teamId, selectedContracts };
      localStorage.setItem("formData", JSON.stringify(data));
      window.location.href = "/app/new";
    }
  };

  const handleContractSelection = (id: string) => {
    setSelectedContracts(prevState =>
      prevState.includes(id)
        ? prevState.filter(contractId => contractId !== id)
        : [...prevState, id]
    );
  };

  // console.log(teams)

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 md:p-10 xl:p-12 shadow-lg rounded-md">
      <div className="p-1 md:p-4 flex flex-col gap-5 bg-gray-100 rounded">
        {userDetails != null ? (
          <div className="p-1 md:p-4 flex flex-col gap-5">
            <div className="relative flex overflow-auto gap-8 border-b pb-5 items-center">
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3.5 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[11rem] xl:w-[15rem] bg-[#31A05D]"></span>
              </p>
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3.5 rounded-full font-bold">
                  2
                </span>
                Configure layout
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              </p>
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3.5 rounded-full font-bold">
                  3
                </span>
                Preview the app
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              </p>
              <p className="flex gap-4 lg:gap-3 items-center text-[#414A53] lg:text-lg">
                <span className="bg-[#DADBE2]  p-1 px-3 md:px-3.5 rounded-full font-bold">
                  4
                </span>
                Select Thumbnail
              </p>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="text-[#727679] font-semibold text-lg xl:text-xl"
              >
                Title (Limit: 32 characters)
              </label>
              <input
                type="text"
                maxLength={32}
                className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 px-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] placeholder:italic"
                placeholder="Enter app title.."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              {fieldErrors.title && (
                <p className="text-red-500 mt-2">Title is required.</p>
              )}
              <br></br>

              <label
                htmlFor="description"
                className="text-[#727679] font-semibold text-lg xl:text-xl"
              >
                Description
              </label>
              <textarea
                className="description focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 bg-[#F7F8FB] xl:text-2xl text-[#21262C] resize-none placeholder:italic"
                placeholder="Enter app description.."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="">
              <p className="text-[#727679] font-semibold text-lg xl:text-xl">
              Visibility / Accessibility
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="public"
                  name="privacy"
                  value="public"
                  checked={privacy === "public"}
                  onChange={(e) => setPrivacy(e.target.value)}
                />
                <label htmlFor="public" className="ml-2 text-[#727679] text-lg xl:text-xl">
                  Public
                </label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="private"
                  name="privacy"
                  value="private"
                  checked={privacy === "private"}
                  onChange={(e) => setPrivacy(e.target.value)}
                />
                <label htmlFor="private" className="ml-2 text-[#727679] text-lg xl:text-xl">
                  Private
                </label>
              </div>
              {privacy === "private" && (
                <div className="mt-2">
                  <label
                    htmlFor="team"
                    className="text-[#727679] font-semibold text-lg xl:text-xl"
                  >
                    Select a team:
                  </label>
                  <select
                  // key={Math.random()}
                    id="team"
                    className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                  >
                    <option key="" value="" disabled>
                      Select a team
                    </option>
                    {teams.filter(team => team != null).map((team) => (
                      <option key={team.id} value={team.id}>
                        {/* {console.log(team)}
                        {console.log(team.name)}
                        {console.log(team.id)} */}
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.privacy && (
                    <p className="text-red-500 mt-2">
                      Please select a team or create one.
                    </p>
                  )}
                </div>
              )}
              {privacy === "private" && teamId && contractGroupsFetched && contractGroups.length === 0 && (
                <p className="text-[#727679] mt-2">
                  No contract groups available for the selected team.
                </p>
              )}
              {privacy === "private" && contractGroups.length > 0 && (
                <div className="mt-2">
                  <label
                    htmlFor="contract-groups"
                    className="text-[#727679] font-semibold text-lg xl:text-xl"
                  >
                    Select Contract Groups:
                  </label>
                  <div id="contract-groups">
                    {contractGroups.map((group) => (
                      <div key={group.id} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`contract-${group.id}`}
                          name="contractGroups"
                          value={group.id}
                          checked={selectedContracts.includes(group.id)}
                          onChange={() => handleContractSelection(group.id)}
                        />
                        <label
                          htmlFor={`contract-${group.id}`}
                          className="ml-2 text-[#727679] text-lg xl:text-xl"
                        >
                          {group.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link to="#" onClick={handleSaveNext} className="mx-0">
                <button
                  className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                  type="submit"
                >
                  Save & Next
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5">
            <p className="text-[#727679] mb-4">
              You need to log in to create custom apps.
            </p>
            <a
              href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`}
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
      {showTeams && <AppVisibilitySelector setShowTeams={setShowTeams} />}
    </div>
  );
};

export default ConfigureBasicDetails;

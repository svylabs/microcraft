import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_API_URL, GITHUB_CLIENT_ID } from "../constants";

const AppVisibilitySelector = ({ setShowTeams }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeams();

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
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsValid(emailRegex.test(email));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
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

        <div className="mt-2">
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-xl font-bold">Create a New Team</h3>
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
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md xl:text-xl px-4 py-2 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Team
            </button>
          </div>

          <div className="flex flex-col gap-2 text-left mt-4">
            <h3 className="text-xl font-bold">Your Teams</h3>
            <select
              key={Math.random()}
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] placeholder:italic w-full"
            >
              {teams.length === 0 ? (
                <option key="" value="">
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

          <div className="flex flex-col gap-2 text-left mt-4">
            <h3 className="text-xl font-bold">Add User to Team</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={handleChange}
              className={`p-2 border rounded focus:outline-none ${isValid ? "border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent" : "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"}`}
            />
            <button
              onClick={handleAddUserToTeam}
              className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md xl:text-xl px-4 py-2 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-2"
            >
              Add User to Team
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AppVisibilitySelector;

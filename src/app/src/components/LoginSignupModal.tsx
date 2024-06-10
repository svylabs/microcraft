import React, { useState, useEffect, useRef } from "react";
import { BASE_API_URL, GITHUB_CLIENT_ID } from "./constants";
import GoogleLogo from "./photos/google-icon.svg";
import GithubLogo from "./photos/github-icon.svg";

const LoginSignupModal = ({ closeModal }: { closeModal: () => void }) => {
  const [userData, setUserData] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserData();
    fetchTeams();

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeModal]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          console.error("Response is not valid JSON");
        }
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/teams/list`, {
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          }
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

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setUserData(null);
        closeModal();
        localStorage.removeItem("userDetails");
        window.location.reload();
      } else {
        console.error("Failed to logout:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/google/login`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        closeModal();
      } else {
        console.error("Failed to login with Google:", response.status);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (teamName.trim() === "" || teamDescription.trim() === "") {
      console.error("Team name and description cannot be empty");
      return;
    }

    if (teams.some((team) => team.name === teamName)) {
      console.error("Team name must be unique");
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
      } else {
        console.error("Failed to create team:", response.status);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleAddUserToTeam = async (teamId: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/teams/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          teamId,
          email: userEmail,
        }),
      });
      if (response.ok) {
        const updatedUsers = await response.json();
        console.log("User added to team successfully:", updatedUsers);
        setUserEmail("");
      } else {
        console.error("Failed to add user to team:", response.status);
      }
    } catch (error) {
      console.error("Error adding user to team:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-md p-4 md:p-8 w-full max-w-md relative"
      >
        <span
          className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-500 text-2xl rounded-full  pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-700 hover:text-white hover:scale-110"
          onClick={closeModal}
        >
          &times;
        </span>

        {userData ? (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-2xl font-bold">Welcome, {userData.login}</h2>
            <p className="text-gray-600">Created on: {userData.created_on}</p>
            <img
              className="mx-auto w-32 h-32 rounded-full object-cover"
              src={userData.avatar_url}
              alt="User Avatar"
            />
            <button
              onClick={handleLogout}
              className="mx-auto cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md xl:text-xl px-4 py-2 font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Log out
            </button>

            <div className="flex flex-col gap-4 text-left mt-4">
              <h3 className="text-xl font-bold">Create a New Team</h3>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="p-2 border rounded"
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

            <div className="flex flex-col gap-4 text-left mt-4">
              <h3 className="text-xl font-bold">Add User to Team</h3>
              <input
                type="text"
                placeholder="User Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="p-2 border rounded"
              />
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleAddUserToTeam(team.id)}
                  className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md xl:text-xl px-4 py-2 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-2"
                >
                  Add to {team.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-left mt-4">
              <h3 className="text-xl font-bold">Your Teams</h3>
              {/* {teams.map((team) => (
                <div key={team.id} className="border p-2 rounded">
                  <h4 className="font-semibold">{team.name}</h4>
                  <p>{team.description}</p>
                </div>
              ))} */}
               <select
                  key={Math.random()}
                    id="team"
                    className="focus:outline-none border border-[#E2E3E8] rounded-lg mt-1 p-3 px-4 bg-[#F7F8FB] xl:text-2xl text-[#21262C] placeholder:italic w-full"
                  >
                    {/* {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))} */}
                    {teams.filter(team => team != null).map((team) => (
                      <option key={Math.random()} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 py-5 bg-gray-100 rounded-md shadow-md">
            <p className="text-[#727679] mb-4 text-center font-medium">
              Elevate your experience! Sign in to build and publish custom apps.
            </p>

            <div className="flex flex-col space-y-4">
              <a
                href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`}
                className="mx-auto md:mx-0 w-full"
              >
                <button
                  className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
                  type="submit"
                >
                  <img
                    src={GithubLogo}
                    alt="Github Logo"
                    className="w-6 h-6 mr-2"
                  />
                  Login with GitHub
                </button>
              </a>

              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
              >
                <img
                  src={GoogleLogo}
                  alt="Google Logo"
                  className="w-6 h-6 mr-2"
                />
                Login with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignupModal;

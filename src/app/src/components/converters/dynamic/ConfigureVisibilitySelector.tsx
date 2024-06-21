import React, { useState, useEffect, useRef } from "react";
import arrow from "../../photos/angle-right-solid.svg";
import { Link } from "react-router-dom";
import { GITHUB_CLIENT_ID, BASE_API_URL } from "~/components/constants";
import AppVisibilitySelector from "../../AppVisibility/AppVisibilitySelector";

interface Team {
  id: string;
  name: string;
}

interface ContractGroup {
  owner: string;
  name: string;
  id: string;
}

interface ContractInstance {
  network: {
    rpc_url: any;
    chain_id: any;
  };
  contracts: {
    name: any;
    address: any;
  }[];
}

const ConfigureBasicDetails: React.FC = () => {
  const [privacy, setPrivacy] = useState("public");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    privacy: false,
  });
  const [showTeams, setShowTeams] = useState(false);
  const [privateContractGroups, setPrivateContractGroups] = useState<ContractGroup[]>([]);
  const [publicContractGroups, setPublicContractGroups] = useState<ContractGroup[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<{ [key: string]: boolean; }>({});
  const [contractGroupsFetched, setContractGroupsFetched] = useState(false);
  const [contractGroupsData, setContractGroupsData] = useState<any[]>([]);
  const [instances, setInstances] = useState<ContractInstance[]>([]);
  const [contractDetails, setContractDetails] = useState<{ [key: string]: { addresses: string[] }[] }>({});
  const [networkDetails, setNetworkDetails] = useState({
    rpc_url: "",
    chain_id: "",
  });

  useEffect(() => {
    if (privacy === "private") {
      fetchTeams();
    }
    // fetchPublicContractGroups();
  }, [privacy]);

  useEffect(() => {
    if (teamId) {
      fetchPrivateContractGroups();
      fetchPublicContractGroups();
    }
  }, [teamId]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/teams/list`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        console.error("Failed to fetch teams list:", response.status);
      }
    } catch (error) {
      console.error("Error fetching teams list:", error);
    }
  };

  const fetchPrivateContractGroups = async () => {
    setContractGroupsFetched(false);
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
        const contractGroups: ContractGroup[] = await response.json();
        setPrivateContractGroups(contractGroups);
        await fetchContractGroupData(contractGroups);
      } else {
        console.error(
          "Failed to fetch private contract groups:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching private contract groups:", error);
    }
    setContractGroupsFetched(true);
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
        const contractGroups: ContractGroup[] = await response.json();
        setPublicContractGroups(contractGroups);
        await fetchContractGroupData(contractGroups);
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

  const fetchContractGroupData = async (contractGroups: ContractGroup[]) => {
    try {
      const instancesPromises = contractGroups.map(async (group) => {
        if (!group.id) {
          console.warn('Skipping group without ID:', group);
          return [];
        }
  
        console.log(`Fetching instances for group: ${group.id}`);
        const response = await fetch(`${BASE_API_URL}/contract-registry/group/get/${group.id}`);
        if (response.ok) {
          const data = await response.json();
          // setContractGroupsData(data);
          setContractGroupsData((prevData) => [...prevData, data]);
          console.log(`Data for group ${group.id}:`, data);
          
          const contracts = data.contracts;
          console.log(`Contracts for group ${group.id}:`, contracts);
  
          if (Array.isArray(contracts)) {
            const instances = contracts.flatMap(contract => contract.instances || []);
            console.log(`Instances for group ${group.id}:`, instances);
            return instances;
          } else {
            console.error(`Expected contracts to be an array for group ${group.id}`);
            return [];
          }
        } else {
          console.error(`Failed to fetch contract instances for group ${group.id}:`, response.status);
          return [];
        }
      });
      
      const allInstances = (await Promise.all(instancesPromises)).flat();
      setInstances(allInstances);
    } catch (error) {
      console.error("Error fetching contract instances:", error);
    }
  };
  console.log(contractGroupsData);

  const handleSaveNext = () => {
    if (privacy === "private" && !teamId) {
      setFieldErrors({ ...fieldErrors, privacy: true });
      return;
    } else {
      const selectedContractNames = Object.keys(selectedContracts).filter(
        (contract) => selectedContracts[contract]
      );
      const existingFormData = localStorage.getItem("formData");
      const existingData = existingFormData ? JSON.parse(existingFormData) : {};
      const newData = {
        ...existingData,
        privacy,
        teamId,
        selectedContracts: selectedContractNames,
        networkDetails
      };
      localStorage.setItem("formData", JSON.stringify(newData));
      window.location.href = "/app/new/field";
    }
  };

  const handleContractSelection = (idName: string) => {
    setSelectedContracts(prevSelected => ({
      ...prevSelected,
      [idName]: !prevSelected[idName],
    }));
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNetworkDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleContractAddressChange = (contractName: string, index: number, addressIndex: number, value: string) => {
    setContractDetails(prevDetails => ({
      ...prevDetails,
      [contractName]: prevDetails[contractName].map((detail, i) => i === index ? {
        ...detail,
        addresses: detail.addresses.map((addr, ai) => ai === addressIndex ? value : addr),
      } : detail),
    }));
  };

  const handleAddContractDetail = (contractName: string) => {
    setContractDetails(prevDetails => ({
      ...prevDetails,
      [contractName]: [...(prevDetails[contractName] || []), { addresses: [""] }],
    }));
  };
  
  

  console.log("contractDetails:- " ,contractDetails)

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12">
      <div className="p-1 md:p-4 bg-gray-100 rounded">
        <div className="p-1 md:p-4 flex flex-col gap-5">
          <div className="relative flex overflow-auto gap-5 md:gap-8 lg:gap-5 xl:gap-2 border-b pb-5 items-center">
            <Link to="/app/inbuilt/New-App" className="group">
              <p className="flex gap-2 items-center text-[#414A53]">
                <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3 rounded-full font-bold">
                  1
                </span>
                Configure basic details
                <img className="w-5 h-5" src={arrow} alt="arrow"></img>
                <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] lg:w-[9rem] xl:w-[12.5rem] bg-[#31A05D]  opacity-0 group-hover:opacity-55 transition-opacity"></span>
              </p>
            </Link>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
                2
              </span>
              Configure Visibility
              <img className="w-5 h-5" src={arrow} alt="arrow"></img>
              <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[11rem] bg-[#31A05D]"></span>
            </p>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                3
              </span>
              Configure layout
              <img className="w-5 h-5" src={arrow} alt="arrow"></img>
            </p>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                4
              </span>
              Preview the app
              <img className="w-5 h-5" src={arrow} alt="arrow"></img>
            </p>
            <p className="flex gap-2 items-center text-[#414A53]">
              <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
                5
              </span>
              Publish the app
            </p>
          </div>

          <div className="">
            <p className="text-[#727679] font-semibold text-lg xl:text-xl">
              Visibility
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
              <label
                htmlFor="public"
                className="ml-2 text-[#727679] text-lg xl:text-xl"
              >
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
              <label
                htmlFor="private"
                className="ml-2 text-[#727679] text-lg xl:text-xl"
              >
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
                  {teams
                    .filter((team) => team != null)
                    .map((team) => (
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
            {privacy === "private" &&
              teamId &&
              contractGroupsFetched &&
              privateContractGroups.length === 0 && (
                <p className="text-[#c055ce] mt-2">
                  No private contract groups available for the selected team.
                </p>
              )}
            {privacy === "private" && privateContractGroups.length > 0 && (
              <div className="mt-2">
                <label
                  htmlFor="contract-groups"
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Private Contract Groups:
                </label>
                <div id="contract-groups">
                  {privateContractGroups.map((group, index) => (
                    <div
                      key={`${group.name}-${index}`}
                      className="flex items-center mt-2"
                    >
                      {/* {console.group(group)}
                        {console.group(group.owner)} */}
                      <input
                        type="checkbox"
                        id={`private-${group.name}-${index}`}
                        name={group.name}
                        value={`${group.owner}-${group.name}`}
                        // checked={!!selectedContracts[group.name]}
                        // onChange={() => handleContractSelection(group.name)}
                        checked={selectedContracts[`${group.name}`] || false}
                        onChange={() => handleContractSelection(`${group.name}`)}    
                      />
                      <label
                        htmlFor={`private-${group.name}-${index}`}
                        className="ml-2 text-[#727679] text-lg xl:text-xl"
                      >
                        {group.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {privacy === "private" && publicContractGroups.length > 0 && (
              <div className="mt-2">
                <label
                  htmlFor="contract-groups"
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Public Contract Groups:
                </label>
                <div id="contract-groups">
                  {publicContractGroups.map((group, index) => (
                    <div
                      key={`${group.name}-${index}`}
                      className="flex items-center mt-2"
                    >
                      <input
                        type="checkbox"
                        id={`public-${group.name}-${index}`}
                        name={group.name}
                        value={`${group.owner}-${group.name}`}
                        // checked={!!selectedContracts[group.name]}
                        // onChange={() => handleContractSelection(group.name)}
                        checked={selectedContracts[`${group.name}`] || false}
                        onChange={() => handleContractSelection(`${group.name}`)}
                      />
                      <label
                        htmlFor={`public-${group.name}-${index}`}
                        className="ml-2 text-[#727679] text-lg xl:text-xl"
                      >
                        {group.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* {privacy === "private" && teamId && contractGroupsFetched && privateContractGroups.length > 0 && ( */}
            {privacy === "private" && teamId && contractGroupsFetched && instances.length === 0 && (
        <div className="mt-4">
          <label className="text-[#727679] font-semibold text-lg xl:text-xl">Contract Details:</label>
          
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Network</label>
              <input
                type="text"
                name="rpc_url"
                value={networkDetails.rpc_url}
                onChange={handleNetworkChange}
                className="border rounded p-2"
                placeholder="RPC URL"
              />
              <input
                type="text"
                name="chain_id"
                value={networkDetails.chain_id}
                onChange={handleNetworkChange}
                className="border rounded p-2"
                placeholder="Chain ID"
              />
            </div>
            
          {Object.keys(selectedContracts).filter(contract => selectedContracts[contract]).map((contract, contractIndex) => (
            <div key={contract} className="mt-2">
              <label className="text-[#727679] text-lg xl:text-xl">{contract}:</label>
              <button
                className="ml-2 bg-[#21262C] hover:bg-[#161b22] text-white font-semibold p-2 rounded-lg text-sm xl:text-base"
                onClick={() => handleAddContractDetail(contract)}
              >
                Add Network & Address
              </button>
              <table className="min-w-full bg-white mt-2">
                <thead>
                  <tr>
                    <th className="py-2">Contract Name</th>
                    <th className="py-2">Addresses</th>
                  </tr>
                </thead>
                <tbody>
                  {(contractDetails[contract] || []).map((detail, index) => (
                    <tr key={`${contract}-detail-${index}`}>
                        {/* display all contract name by contractGroupsData.contracts[0].name */}
                        {contractGroupsData.map((contractGroup, groupIndex) =>
                contractGroup.contracts.map((contract, contractIndex) => (
                  <td className="px-4">{contract.name}</td>
                )))}
                      <td className="border px-4 py-2">
                        {detail.addresses.map((address, addressIndex) => (
                          <div key={`${contract}-address-${index}-${addressIndex}`} className="flex items-center mt-2">
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => handleContractAddressChange(contract, index, addressIndex, e.target.value)}
                              className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
                              placeholder="Enter contract address"
                            />
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
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
      </div>
      {showTeams && <AppVisibilitySelector setShowTeams={setShowTeams} />}
    </div>
  );
};

export default ConfigureBasicDetails;
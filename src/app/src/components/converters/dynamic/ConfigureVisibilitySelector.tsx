import React, { useState, useEffect, useRef } from "react";
import arrow from "../../photos/angle-right-solid.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GITHUB_CLIENT_ID, BASE_API_URL } from "~/components/constants";
import AppVisibilitySelector from "../../ManageTeams/ManageTeamsSelector";
import useDebounce from './Renderer/useDebounce';

interface Team {
  id: string;
  name: string;
}

interface ContractGroup {
  owner: string;
  name: string;
  description: string;
  id: string;
}

interface ContractInstance {
  network: {
    type: "",
    config: {
      rpcUrl: "",
      chainId: "",
      exploreUrl: "(optional)",
    },
  };
  contracts: {
    name: any;
    address: any;
  }[];
}

interface NetworkDetails {
  type: string;
  config: {
    rpcUrl: string;
    chainId: string;
    exploreUrl: string;
  };
}

const ConfigureVisibilitySelector: React.FC = () => {
  const [privacy, setPrivacy] = useState("");
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
  const [contractDetails, setContractDetails] = useState<{ name: string, address: string, abi: any[] }[]>([]);
  const [networkDetails, setNetworkDetails] = useState<NetworkDetails>({
    type: "ethereum",
    config: {
      rpcUrl: "",
      chainId: "",
      exploreUrl: "",
    },
  });

  const [localConfig, setLocalConfig] = useState("");
  const debouncedConfig = useDebounce(localConfig, 2000);
  const networkConfigJson = JSON.stringify(networkDetails, null, 2);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (privacy === "private") {
      fetchTeams();
    } else {
      fetchPublicContractGroups();
    }
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
    setContractGroupsFetched(false);
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
    setContractGroupsFetched(true);
  };

  const fetchContractGroupData = async (contractGroups: ContractGroup[]) => {
    try {
      const newContractGroupsData: any[] = [];
      const instancesPromises = contractGroups.map(async (group) => {
        if (!group.id) {
          console.warn('Skipping group without ID:', group);
          return [];
        }
        console.log(`Fetching instances for group: ${group.id}`);
        const response = await fetch(`${BASE_API_URL}/contract-registry/group/get/${group.id}`);
        if (response.ok) {
          const data = await response.json();
          newContractGroupsData.push(data);
          console.log('Group Data:', data);
          const contracts = data.contracts;
          console.log(`Contracts for group ${group.id}:`, contracts);
          if (Array.isArray(contracts)) {
            const instances = contracts.flatMap(contract => contract.instances || []);
            console.log('Instances:', instances);
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
      setContractGroupsData(newContractGroupsData);
    } catch (error) {
      console.error("Error fetching contract instances:", error);
    }
  };

  const handleSaveNext = () => {
    if (!privacy) {
      toast.error("Please select privacy settings.");
      return;
    }

    if (privacy === "private" && !teamId) {
      setFieldErrors({ ...fieldErrors, privacy: true });
      return;
    }

    const selectedContractNames = Object.keys(selectedContracts).filter(
      (contract) => selectedContracts[contract]
    );

    // if (privacy === "private" && selectedContractNames.length === 0) {
    //   toast.error("Please select at least one contract group.");
    //   return;
    // }

    const allAddressesProvided = selectedContractNames.every(contractName =>
      contractDetails.some(detail => detail.address !== "")
    );

    if (!allAddressesProvided) {
      toast.error("Please provide addresses for all selected contract groups.");
      return;
    }

    const existingFormData = localStorage.getItem("formData");
    const existingData = existingFormData ? JSON.parse(existingFormData) : {};
    const newData = {
      ...existingData,
      privacy,
      teamId,
      selectedContracts: selectedContractNames,
      networkDetails,
      contractDetails,
      contractGroupsData: selectedContractNames.map(contractName =>
        contractGroupsData.find(groupData => groupData.name === contractName)
      ),
    };
    localStorage.setItem("formData", JSON.stringify(newData));
    window.location.href = "/app/new/field";
  };

  const handleContractSelection = (idName: string) => {
    setSelectedContracts(prevSelected => ({
      ...prevSelected,
      [idName]: !prevSelected[idName],
    }));
  };

  const handleNetworkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNetworkDetails((prevDetails) => ({
      ...prevDetails,
      type: value,
    }));
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setLocalConfig(value);
  };

  useEffect(() => {
    if (debouncedConfig) {
      try {
        const parsedConfig = JSON.parse(debouncedConfig);
        setNetworkDetails(parsedConfig);
      } catch (error) {
        toast.error("Invalid JSON format. Please provide valid JSON.");
      }
    }
  }, [debouncedConfig]);

  const handleAddressChange = (contractName: string, address: string) => {
    const contractGroup = contractGroupsData.find(group => {
      return group.contracts.some(contract => contract.name === contractName);
    });

    if (!contractGroup) {
      console.error(`Contract group data not found for contract: ${contractName}`);
      console.log('Available contract groups:', contractGroupsData);
      return;
    }

    const contract = contractGroup.contracts.find(contract => contract.name === contractName);

    if (!contract) {
      console.error(`Contract data not found for contract: ${contractName}`);
      return;
    }

    const abi = contract.versions[0]?.properties?.abi || [];

    setContractDetails(prevDetails => {
      const newDetails = prevDetails.filter(contract => contract.name !== contractName);
      newDetails.push({ name: contractName, address, abi });
      return newDetails;
    });
  };

  const updateTextareaNumber = () => {
    const textarea = textareaRef.current;
    const numbers = numbersRef.current;

    const updateLineNumbers = () => {
      if (textarea && numbers) {
        const lines = textarea.value.split("\n").length;
        numbers.innerHTML = Array.from(
          { length: lines },
          (_, index) => index + 1
        ).join("<br>");
      }
    };

    if (textarea) {
      updateLineNumbers();
      textarea.addEventListener("input", updateLineNumbers);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", updateLineNumbers);
      }
    };
  };

  useEffect(() => {
    updateTextareaNumber();
  });

  console.log("contractGroupsData:- ", contractGroupsData)
  console.log("contractDetails:- ", contractDetails)

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
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white rounded font-semibold px-4 py-2"
                    onClick={() => setShowTeams(true)}
                  >
                    Create a team
                  </button>
                </div>
                <label
                  htmlFor="team"
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Select a team:
                </label>
                <select
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
            {privacy === "public" &&
              contractGroupsFetched &&
              publicContractGroups.length === 0 && (
                <p className="text-[#c055ce] mt-2">
                  No Public contract groups available.
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
                      title={group.description}
                    >
                      <input
                        type="checkbox"
                        id={`private-${group.name}-${index}`}
                        name={group.name}
                        value={`${group.owner}-${group.name}`}
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
            {(publicContractGroups.length > 0 && (privacy === "private" && teamId || privacy === "public")) && (
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

            {(privacy === "private" && teamId || privacy === "public") && contractGroupsFetched && instances.length === 0 && (
              <div className="mt-4 ">
                <div className="text-center">
                  <label className="text-[#727679] font-semibold text-lg xl:text-xl underline underline-offset-2">Configure Contract Details</label>
                </div>
                {Object.keys(selectedContracts).filter(contract => selectedContracts[contract]).map((contract, index) => (
                  <div key={contract} className="">
                    <label className="text-gray-700 text-lg xl:text-xl">{contract}:</label>
                    {contractGroupsData.some(contractGroup => contractGroup.name === contract && contractGroup.contracts.length > 0) ? (
                      <div className="overflow-x-auto rounded">
                        <table className="min-w-full bg-white mt-2 shadow-md">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="py-2 px-4 md:px-6 text-left">Contract Name</th>
                              <th className="py-2 px-4 md:px-6 text-left">Addresses</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-300">
                            {contractGroupsData
                              .filter(contractGroup => contractGroup.name === contract)
                              .map((contractGroup, groupIndex) => (
                                contractGroup.contracts.map((contractItem, contractIndex) => (
                                  <tr key={`${contract}-${groupIndex}-${contractItem.id}`}>
                                    <td className="px-4 md:px-6 py-3">{contractItem.name}</td>
                                    <td className="px-4 md:px-6 py-3">
                                      <input
                                        type="text"
                                        className="focus:outline-none border border-gray-300 rounded py-2 px-4 md:px-6 bg-gray-100 text-sm md:text-base w-full"
                                        placeholder="Enter address"
                                        value={contractDetails.find((detail) => detail.name === contractItem.name)?.address || ""}
                                        onChange={(e) => handleAddressChange(contractItem.name, e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                ))
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-[#c055ce]">
                        No contracts list available for {contract}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-gray-700 text-lg xl:text-xl">Network Settings:</label>
                  <select
                    id="networkType"
                    className="flex-grow p-2 border border-gray-300 rounded"
                    value={networkDetails.type}
                    onChange={handleNetworkTypeChange}
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="mina">Mina</option>
                    <option value="keplr">Keplr</option>
                    <option value="cosmoshub-4">Cosmoshub-4</option>
                  </select>
                  <div className="flex bg-gray-900 rounded-md p-2">
                    <div
                      className="px-2 text-gray-500"
                      ref={numbersRef}
                      style={{ whiteSpace: "pre-line", overflowY: "hidden" }}
                    ></div>
                    <textarea
                      ref={textareaRef}
                      className="flex-1 bg-gray-900 text-white outline-none"
                      style={{ overflowY: "hidden" }}
                      value={localConfig || networkConfigJson}
                      onChange={handleNetworkChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Link to="#" onClick={handleSaveNext} className="mx-0">
              <button
                className="cursor-pointer text-white bg-[#31A05D] rounded xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
                type="submit"
              >
                Save & Next
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
      {showTeams && <AppVisibilitySelector setShowTeams={setShowTeams} />}
    </div>
  );
};

export default ConfigureVisibilitySelector;
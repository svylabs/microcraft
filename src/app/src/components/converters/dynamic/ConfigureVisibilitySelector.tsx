// import React, { useState, useEffect, useRef } from "react";
// import arrow from "../../photos/angle-right-solid.svg";
// import { Link } from "react-router-dom";
// import { GITHUB_CLIENT_ID, BASE_API_URL } from "~/components/constants";
// import AppVisibilitySelector from "../../AppVisibility/AppVisibilitySelector";

// interface Team {
//   id: string;
//   name: string;
// }

// interface ContractGroup {
//   owner: string;
//   name: string;
//   id: string;
// }

// interface ContractInstance {
//   network: {
//     rpc_url: any;
//     chain_id: any;
//   };
//   contracts: {
//     address: any;
//   }[];
// }

// const ConfigureBasicDetails: React.FC = () => {
//   const [privacy, setPrivacy] = useState("public");
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [teamId, setTeamId] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({
//     title: false,
//     privacy: false,
//   });
//   const [showTeams, setShowTeams] = useState(false);
//   const [privateContractGroups, setPrivateContractGroups] = useState<
//     ContractGroup[]
//   >([]);
//   const [publicContractGroups, setPublicContractGroups] = useState<
//     ContractGroup[]
//   >([]);
//   const [selectedContracts, setSelectedContracts] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [contractGroupsFetched, setContractGroupsFetched] = useState(false);
//   const [instances, setInstances] = useState<ContractInstance[]>([]);
//   const [network, setNetwork] = useState("");
//   const [contractAddresses, setContractAddresses] = useState<{
//     [key: string]: string;
//   }>({});

//   useEffect(() => {
//     if (privacy === "private") {
//       fetchTeams();
//     }
//     // fetchPublicContractGroups();
//   }, [privacy]);

//   useEffect(() => {
//     if (teamId) {
//       fetchPrivateContractGroups();
//       fetchPublicContractGroups();
//     }
//   }, [teamId]);

//   const fetchTeams = async () => {
//     try {
//       const response = await fetch(`${BASE_API_URL}/teams/list`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Response status:", response.status);
//       if (response.ok) {
//         const teams: Team[] = await response.json();
//         console.log(teams);
//         if (teams.length === 0) {
//           setShowTeams(true);
//         } else {
//           setTeams(teams);
//         }
//       } else {
//         console.error("Failed to fetch teams list:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching teams list:", error);
//     }
//   };

//   const fetchPrivateContractGroups = async () => {
//     setContractGroupsFetched(false);
//     try {
//       const response = await fetch(
//         `${BASE_API_URL}/contract-registry/group/list?owner=${teamId}`,
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.ok) {
//         const contractGroups: ContractGroup[] = await response.json();
//         setPrivateContractGroups(contractGroups);
//         await fetchContractInstances(contractGroups);
//       } else {
//         console.error(
//           "Failed to fetch private contract groups:",
//           response.status
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching private contract groups:", error);
//     }
//     setContractGroupsFetched(true);
//   };

//   const fetchPublicContractGroups = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_API_URL}/contract-registry/group/list?owner=public`,
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.ok) {
//         const contractGroups: ContractGroup[] = await response.json();
//         setPublicContractGroups(contractGroups);
//         await fetchContractInstances(contractGroups);
//       } else {
//         console.error(
//           "Failed to fetch public contract groups:",
//           response.status
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching public contract groups:", error);
//     }
//   };

//   const fetchContractInstances = async (contractGroups: ContractGroup[]) => {
//     const instancesPromises = contractGroups.map(async (group) => {
//       console.log(group.id);
//       const response = await fetch(
//         `${BASE_API_URL}/contract-registry/group/get/${group.id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         return data.instances || [];
//       } else {
//         console.error(
//           `Failed to fetch contract instances for group ${group.id}:`,
//           response.status
//         );
//         return [];
//       }
//     });
//     const allInstances = (await Promise.all(instancesPromises)).flat();
//     console.log(allInstances);
//     setInstances(allInstances);
//   };

//   const handleSaveNext = () => {
//     if (privacy === "private" && !teamId) {
//       setFieldErrors({ ...fieldErrors, privacy: true });
//       return;
//     } else {
//       const selectedContractNames = Object.keys(selectedContracts).filter(
//         (contract) => selectedContracts[contract]
//       );
//       const existingFormData = localStorage.getItem("formData");
//       const existingData = existingFormData ? JSON.parse(existingFormData) : {};
//       const newData = {
//         ...existingData,
//         privacy,
//         teamId,
//         selectedContracts: selectedContractNames,
//       };
//       localStorage.setItem("formData", JSON.stringify(newData));
//       window.location.href = "/app/new/field";
//     }
//   };

//   const handleContractSelection = (idName: string) => {
//     setSelectedContracts((prevSelected) => ({
//       ...prevSelected,
//       [idName]: !prevSelected[idName],
//     }));
//   };

//   const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setNetwork(event.target.value);
//   };

//   const handleContractAddressChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     contractName: string
//   ) => {
//     setContractAddresses({
//       ...contractAddresses,
//       [contractName]: event.target.value,
//     });
//   };

//   return (
//     <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-md flex flex-col gap-5 p-2 m-2 mt-3 md:m-5 md:p-5 lg:p-6 lg:mx-20 md:mt-2 xl:mx-40 xl:p-12">
//       <div className="p-1 md:p-4 bg-gray-100 rounded">
//         <div className="p-1 md:p-4 flex flex-col gap-5">
//           <div className="relative flex overflow-auto gap-5 md:gap-8 lg:gap-5 xl:gap-2 border-b pb-5 items-center">
//             <Link to="/app/inbuilt/New-App" className="group">
//               <p className="flex gap-2 items-center text-[#414A53]">
//                 <span className="bg-[#31A05D] text-white p-1 px-3 md:px-3 rounded-full font-bold">
//                   1
//                 </span>
//                 Configure basic details
//                 <img className="w-5 h-5" src={arrow} alt="arrow"></img>
//                 <span className="absolute bottom-0 ml-1 h-[2px] w-[7rem] lg:w-[9rem] xl:w-[12.5rem] bg-[#31A05D]  opacity-0 group-hover:opacity-55 transition-opacity"></span>
//               </p>
//             </Link>
//             <p className="flex gap-2 items-center text-[#414A53]">
//               <span className="bg-[#31A05D] text-white  p-1 px-3 md:px-3 rounded-full font-bold">
//                 2
//               </span>
//               Configure Visibility
//               <img className="w-5 h-5" src={arrow} alt="arrow"></img>
//               <span className="absolute bottom-0 h-[2px] w-[8rem] lg:w-[8rem] xl:w-[11rem] bg-[#31A05D]"></span>
//             </p>
//             <p className="flex gap-2 items-center text-[#414A53]">
//               <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
//                 3
//               </span>
//               Configure layout
//               <img className="w-5 h-5" src={arrow} alt="arrow"></img>
//             </p>
//             <p className="flex gap-2 items-center text-[#414A53]">
//               <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
//                 4
//               </span>
//               Preview the app
//               <img className="w-5 h-5" src={arrow} alt="arrow"></img>
//             </p>
//             <p className="flex gap-2 items-center text-[#414A53]">
//               <span className="bg-[#DADBE2]  p-1 px-3 md:px-3 rounded-full font-bold">
//                 5
//               </span>
//               Publish the app
//             </p>
//           </div>

//           <div className="">
//             <p className="text-[#727679] font-semibold text-lg xl:text-xl">
//               Visibility
//             </p>
//             <div className="flex items-center mt-2">
//               <input
//                 type="radio"
//                 id="public"
//                 name="privacy"
//                 value="public"
//                 checked={privacy === "public"}
//                 onChange={(e) => setPrivacy(e.target.value)}
//               />
//               <label
//                 htmlFor="public"
//                 className="ml-2 text-[#727679] text-lg xl:text-xl"
//               >
//                 Public
//               </label>
//             </div>
//             <div className="flex items-center mt-2">
//               <input
//                 type="radio"
//                 id="private"
//                 name="privacy"
//                 value="private"
//                 checked={privacy === "private"}
//                 onChange={(e) => setPrivacy(e.target.value)}
//               />
//               <label
//                 htmlFor="private"
//                 className="ml-2 text-[#727679] text-lg xl:text-xl"
//               >
//                 Private
//               </label>
//             </div>
//             {privacy === "private" && (
//               <div className="mt-2">
//                 <label
//                   htmlFor="team"
//                   className="text-[#727679] font-semibold text-lg xl:text-xl"
//                 >
//                   Select a team:
//                 </label>
//                 <select
//                   // key={Math.random()}
//                   id="team"
//                   className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
//                   value={teamId}
//                   onChange={(e) => setTeamId(e.target.value)}
//                 >
//                   <option key="" value="" disabled>
//                     Select a team
//                   </option>
//                   {teams
//                     .filter((team) => team != null)
//                     .map((team) => (
//                       <option key={team.id} value={team.id}>
//                         {/* {console.log(team)}
//                         {console.log(team.name)}
//                         {console.log(team.id)} */}
//                         {team.name}
//                       </option>
//                     ))}
//                 </select>
//                 {fieldErrors.privacy && (
//                   <p className="text-red-500 mt-2">
//                     Please select a team or create one.
//                   </p>
//                 )}
//               </div>
//             )}
//             {privacy === "private" &&
//               teamId &&
//               contractGroupsFetched &&
//               privateContractGroups.length === 0 && (
//                 <p className="text-[#c055ce] mt-2">
//                   No private contract groups available for the selected team.
//                 </p>
//               )}
//             {privacy === "private" && privateContractGroups.length > 0 && (
//               <div className="mt-2">
//                 <label
//                   htmlFor="contract-groups"
//                   className="text-[#727679] font-semibold text-lg xl:text-xl"
//                 >
//                   Private Contract Groups:
//                 </label>
//                 <div id="contract-groups">
//                   {privateContractGroups.map((group, index) => (
//                     <div
//                       key={`${group.name}-${index}`}
//                       className="flex items-center mt-2"
//                     >
//                       {/* {console.group(group)}
//                         {console.group(group.owner)} */}
//                       <input
//                         type="checkbox"
//                         id={`private-${group.name}`}
//                         name="privateContractGroups"
//                         value={`${group.owner}-${group.name}`}
//                         checked={!!selectedContracts[group.name]}
//                         onChange={() => handleContractSelection(group.name)}
//                         // checked={!!selectedContracts[`${group.owner}-${group.name}`]}
//                         // onChange={() => handleContractSelection(`${group.owner}-${group.name}`)}
//                       />
//                       <label
//                         htmlFor={`private-${group.name}`}
//                         className="ml-2 text-[#727679] text-lg xl:text-xl"
//                       >
//                         {group.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {privacy === "private" && publicContractGroups.length > 0 && (
//               <div className="mt-2">
//                 <label
//                   htmlFor="contract-groups"
//                   className="text-[#727679] font-semibold text-lg xl:text-xl"
//                 >
//                   Public Contract Groups:
//                 </label>
//                 <div id="contract-groups">
//                   {publicContractGroups.map((group, index) => (
//                     <div
//                       key={`${group.name}-${index}`}
//                       className="flex items-center mt-2"
//                     >
//                       <input
//                         type="checkbox"
//                         id={`public-${group.name}`}
//                         name="publicContractGroups"
//                         value={`${group.owner}-${group.name}`}
//                         checked={!!selectedContracts[group.name]}
//                         onChange={() => handleContractSelection(group.name)}
//                         // checked={!!selectedContracts[`${group.owner}-${group.name}`]}
//                         // onChange={() => handleContractSelection(`${group.owner}-${group.name}`)}
//                       />
//                       <label
//                         htmlFor={`public-${group.name}`}
//                         className="ml-2 text-[#727679] text-lg xl:text-xl"
//                       >
//                         {group.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {instances.length > 0 && (
//               <div className="mt-4">
//                 <p className="text-[#727679] font-semibold text-lg xl:text-xl">
//                   Contract Instances:
//                 </p>
//                 <label htmlFor="network" className="block text-[#727679] mt-2">
//                   Select Network:
//                 </label>
//                 <select
//                   id="network"
//                   className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
//                   value={network}
//                   onChange={handleNetworkChange}
//                 >
//                   <option value="" disabled>
//                     Select Network
//                   </option>
//                   {instances.map((instance, index) => (
//                     <option key={index} value={instance.network.rpc_url}>
//                       {instance.network.chain_id} - {instance.network.rpc_url}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="mt-2">
//                   {instances.map((instance, index) => (
//                     <div key={index} className="flex flex-col">
//                       <label
//                         htmlFor={`contractAddress-${index}`}
//                         className="block text-sm font-medium leading-6 text-gray-900"
//                       >
//                         {instance.network.chain_id} -{" "}
//                         {instance.contracts[0].address}
//                       </label>
//                       <input
//                         id={`contractAddress-${index}`}
//                         name={`contractAddress-${index}`}
//                         type="text"
//                         placeholder="Enter contract address"
//                         value={
//                           contractAddresses[instance.network.chain_id] || ""
//                         }
//                         onChange={(e) =>
//                           handleContractAddressChange(
//                             e,
//                             instance.network.chain_id
//                           )
//                         }
//                         className="mt-1 px-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {instances.length === 0 && (
//               <div className="mt-4">
//                 <p className="text-[#c055ce]">
//                   No instances found for the selected contract groups. Please
//                   enter details manually.
//                 </p>
//                 <div className="mt-2">
//                   <label
//                     htmlFor="manualChainId"
//                     className="block text-[#727679] mt-2"
//                   >
//                     Enter Chain ID:
//                   </label>
//                   <input
//                     type="number"
//                     id="manualChainId"
//                     className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
//                     placeholder="Enter chain ID.."
//                     value={
//                       network ? instances[0].network.chain_id.toString() : ""
//                     }
//                     onChange={(e) => {
//                       const chainId = parseInt(e.target.value);
//                       if (!isNaN(chainId)) {
//                         setNetwork(chainId.toString());
//                       }
//                     }}
//                   />
//                 </div>
//                 <div className="mt-2">
//                   <label
//                     htmlFor="manualRpcUrl"
//                     className="block text-[#727679] mt-2"
//                   >
//                     Enter RPC URL:
//                   </label>
//                   <input
//                     type="text"
//                     id="manualRpcUrl"
//                     className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
//                     placeholder="Enter RPC URL.."
//                     value={contractAddresses[network] || ""}
//                     onChange={(e) => handleContractAddressChange(e, network)}
//                   />
//                 </div>
//                 <div className="mt-2">
//                   <label
//                     htmlFor="manualAddress"
//                     className="block text-[#727679] mt-2"
//                   >
//                     Enter Contract Address:
//                   </label>
//                   <input
//                     type="text"
//                     id="manualAddress"
//                     className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
//                     placeholder="Enter contract address.."
//                     value={contractAddresses[network] || ""}
//                     onChange={(e) => handleContractAddressChange(e, network)}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex justify-end">
//             <Link to="#" onClick={handleSaveNext} className="mx-0">
//               <button
//                 className="cursor-pointer text-white bg-[#31A05D] rounded-md xl:text-xl p-2 md:p-3 md:px-5 font-semibold text-center"
//                 type="submit"
//               >
//                 Save & Next
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//       {showTeams && <AppVisibilitySelector setShowTeams={setShowTeams} />}
//     </div>
//   );
// };

// export default ConfigureBasicDetails;



import React, { useState, useEffect } from "react";
import arrow from "../../photos/angle-right-solid.svg";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "~/components/constants";
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
    rpc_url: string;
    chain_id: number;
  };
  contracts: {
    address: string;
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
  const [privateContractGroups, setPrivateContractGroups] = useState<
    ContractGroup[]
  >([]);
  const [publicContractGroups, setPublicContractGroups] = useState<
    ContractGroup[]
  >([]);
  const [selectedContracts, setSelectedContracts] = useState<{
    [key: string]: boolean;
  }>({});
  const [contractGroupsFetched, setContractGroupsFetched] = useState(false);
  const [instances, setInstances] = useState<ContractInstance[]>([]);
  const [network, setNetwork] = useState("");
  const [contractAddresses, setContractAddresses] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (privacy === "private") {
      fetchTeams();
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
      if (response.ok) {
        const teams: Team[] = await response.json();
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
        await fetchContractInstances(contractGroups);
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
        await fetchContractInstances(contractGroups);
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

  const fetchContractInstances = async (contractGroups: ContractGroup[]) => {
    const instancesPromises = contractGroups.map(async (group) => {
      const response = await fetch(
        `${BASE_API_URL}/contract-registry/group/get/${group.id}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.instances || [];
      } else {
        console.error(
          `Failed to fetch contract instances for group ${group.id}:`,
          response.status
        );
        return [];
      }
    });
    const allInstances = (await Promise.all(instancesPromises)).flat();
    setInstances(allInstances);
  };

  const handleSaveNext = () => {
    if (privacy === "private" && !teamId) {
      setFieldErrors({ ...fieldErrors, privacy: true });
      return;
    } else {
      const selectedContractNames = Object.keys(selectedContracts).filter(
        (contract) => selectedContracts[contract]
      );
      const newData = {
        privacy,
        teamId,
        selectedContracts: selectedContractNames,
      };
      localStorage.setItem("formData", JSON.stringify(newData));
      window.location.href = "/app/new/field";
    }
  };

  const handleContractSelection = (groupName: string) => {
    setSelectedContracts((prevSelected) => ({
      ...prevSelected,
      [groupName]: !prevSelected[groupName],
    }));
  };

  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(event.target.value);
  };

  const handleContractAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    contractName: string
  ) => {
    setContractAddresses({
      ...contractAddresses,
      [contractName]: event.target.value,
    });
  };

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
            {/* Additional steps */}
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
                  id="team"
                  className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {showTeams && (
                  <Link
                    to="/app/new/field"
                    className="ml-auto underline text-[#31A05D] font-bold text-lg xl:text-xl"
                  >
                    Create a team
                  </Link>
                )}
              </div>
            )}
            {privacy === "private" && teamId && (
              <div className="mt-2">
                <label
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Select private contract groups:
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {contractGroupsFetched ? (
                    privateContractGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={group.id}
                          checked={selectedContracts[group.name]}
                          onChange={() => handleContractSelection(group.name)}
                        />
                        <label
                          htmlFor={group.id}
                          className="text-[#727679] text-lg xl:text-xl"
                        >
                          {group.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Loading private contract groups...</p>
                  )}
                </div>
              </div>
            )}
            {privacy === "public" && (
              <div className="mt-2">
                <label
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Select public contract groups:
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {publicContractGroups.map((group) => (
                    <div key={group.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={group.id}
                        checked={selectedContracts[group.name]}
                        onChange={() => handleContractSelection(group.name)}
                      />
                      <label
                        htmlFor={group.id}
                        className="text-[#727679] text-lg xl:text-xl"
                      >
                        {group.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display instances or input fields */}
            {Object.keys(selectedContracts).filter(
              (contract) => selectedContracts[contract]
            ).length > 0 && instances.length > 0 ? (
              <div className="mt-4">
                <label
                  className="text-[#727679] font-semibold text-lg xl:text-xl"
                >
                  Select an instance:
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {instances.map((instance, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`instance-${index}`}
                        name="instance"
                        value={instance.network.rpc_url}
                        onChange={(e) => setNetwork(e.target.value)}
                      />
                      <label
                        htmlFor={`instance-${index}`}
                        className="text-[#727679] text-lg xl:text-xl"
                      >
                        {instance.network.rpc_url}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {Object.keys(selectedContracts).map((contractName) => (
                  <div key={contractName} className="mt-2">
                    <label
                      className="text-[#727679] font-semibold text-lg xl:text-xl"
                    >
                      Network:
                    </label>
                    <select
                      className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
                      value={network}
                      onChange={handleNetworkChange}
                    >
                      <option value="">Select a network</option>
                      <option value="testnet">Testnet</option>
                      <option value="mainnet">Mainnet</option>
                    </select>
                    <label
                      className="text-[#727679] font-semibold text-lg xl:text-xl mt-2"
                    >
                      Contract Address:
                    </label>
                    <input
                      type="text"
                      className="focus:outline-none border border-[#E2E3E8] rounded p-2 bg-[#F7F8FB] text-[#21262C] text-lg xl:text-xl placeholder:italic w-full"
                      placeholder="Enter contract address"
                      value={contractAddresses[contractName] || ""}
                      onChange={(e) =>
                        handleContractAddressChange(e, contractName)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={handleSaveNext}
          className="bg-[#31A05D] text-white p-3 rounded-md text-lg xl:text-xl font-bold focus:outline-none"
        >
          Save and Next
        </button>
      </div>
    </div>
  );
};

export default ConfigureBasicDetails;

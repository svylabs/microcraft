import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Web3 from "web3";
import { toast } from "react-toastify";
import { SigningStargateClient } from "@cosmjs/stargate";
import Wallet from "../Web3/DropdownConnectedWallet";
import Graph from "../outputPlacement/GraphComponent";
import Table from "../outputPlacement/TableComponent";
import TextOutput from "../outputPlacement/TextOutput";
import DescriptionComponent from '../outputPlacement/DescriptionComponent';
import TransactionLink from '../outputPlacement/TransactionLink';
import Loading from "../loadingPage/Loading";
import Swap from "../Web3/Swap/WalletSwap";
import JsonViewer from './JsonViewer';
import Alert from "./Alert";
import { ERC20_ABI } from './ABI/ERC20_ABI';
import { ERC721_ABI } from './ABI/ERC721_ABI';
import { ERC1155_ABI } from './ABI/ERC1155_ABI';

interface Props {
  components: any[];
  networks?: any;
  contracts?: any;
  data: { [key: string]: any };
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  debug: React.Dispatch<React.SetStateAction<any>>;
}

const App: React.FC<Props> = ({ components, data, setData, debug, networks, contracts }) => {
  const [loading, setLoading] = useState(false);
  const [networkDetails, setNetworkDetails] = useState<any[]>([]);
  const [contractDetails, setContractDetails] = useState<any[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState('');
  const [chainId, setChainId] = useState('');
  const [networkStatus, setNetworkStatus] = useState<string>('');
  const [cosmosClient, setCosmosClient] = useState<SigningStargateClient | null>(null);

  useEffect(() => {
    // Update networks details if available
    if (networks) {
      setNetworkDetails(networks);
    }

    // Update contract details if available
    if (contracts) {
      setContractDetails(contracts);
    }
  }, [networks, contracts]);

  console.log("app.TSX-loadedData networkDetails: ", networkDetails);
  console.log("typeof app.TSX-loadedData: ", typeof networkDetails);
  console.log("app.TSX-loadedData: ", contractDetails);
  console.log("typeof app.TSX-loadedData: ", typeof contractDetails);

  const supportedNetworks = networkDetails || [];
  const networkType = supportedNetworks.length > 0 ? supportedNetworks[0]?.type : undefined;
  const rpcUrls = supportedNetworks.length > 0 ? supportedNetworks[0]?.config?.rpcUrl : undefined;
  const chainIds = supportedNetworks.length > 0 ? supportedNetworks[0]?.config?.chainId : undefined;

  const handleNetworkChange = (networkType: string) => {
    if (networkType === "") {
      // If the user selects the default option, reset the connection
      setSelectedNetwork(null);
      setIsConnected(false);
      setNetworkStatus('');
    } else {
      // Set the selected network and mark as connected
      setSelectedNetwork(networkType);
      setNetworkStatus(
        `The application requires access to the <span class="font-bold text-blue-700">${networkType}</span> network. To proceed, please click the <span class="font-bold text-green-800">Switch Network</span> button.`
      );
      setAlertOpen(true);
    }
  };

  const switchToSupportedNetwork = async () => {
    const formatChainId = (chainId) => {
      if (typeof chainId === 'number') {
        return `0x${chainId.toString(16)}`;
      } else if (typeof chainId === 'string' && !chainId.startsWith('0x')) {
        return `0x${parseInt(chainId, 10).toString(16)}`;
      }
      return chainId;
    };

    const selectedNetworkConfig = supportedNetworks.find(network => network.type === selectedNetwork);

    if (!selectedNetworkConfig) {
      setNetworkStatus('No network selected.');
      setAlertOpen(true);
      return;
    }

    const { chainId, rpcUrl, exploreUrl } = selectedNetworkConfig.config;

    // Define a mapping for native currency based on network type
    const nativeCurrencyMapping = {
      ethereum: {
        symbol: 'ETH',
        decimals: 18,
      },
      polygon: {
        symbol: 'MATIC',
        decimals: 18,
      },
      'binance-smart-chain': {
        symbol: 'BNB',
        decimals: 18,
      },
      'citrea-bitcoin': {
        symbol: 'BTC',
        decimals: 18,
      },
      'citrus-bitcoin': {
        symbol: 'CBTC',
        decimals: 8,
      },
    };

    // Retrieve the native currency based on the selected network type
    const nativeCurrency = nativeCurrencyMapping[selectedNetworkConfig.type] || {
      symbol: 'ETH', // Default to ETH if not found
      decimals: 18,
    };

    try {
      // Attempt to switch to the selected network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: formatChainId(chainId) }],
      });

      // If successful, update the state
      setNetworkStatus(`Connected to ${selectedNetworkConfig.type}`);
      setIsConnected(true);
      toast.success(`Successfully connected to ${selectedNetworkConfig.type}`);
      setAlertOpen(false);

    } catch (switchError: any) {
      console.error('Error switching networks:', switchError);

      // If the error is due to the network not being added yet
      if (switchError.code === 4902) {
        try {
          // Add the network to MetaMask
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: formatChainId(chainId),
              chainName: selectedNetworkConfig.type,
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [exploreUrl],
              nativeCurrency: nativeCurrency,
            }],
          });

          setNetworkStatus(`Connected to ${selectedNetworkConfig.type}`);
          setIsConnected(true);
          setAlertOpen(false);
        } catch (addError: any) {
          console.error('Error adding network:', addError);
          setNetworkStatus(`Failed to add network: ${addError.message}`);
          setIsConnected(false);
          setAlertOpen(true);
        }
      } else {
        // Handle other errors
        setNetworkStatus(`This app needs to connect to ${chainId}. Please configure it manually in your wallet.`);
        setIsConnected(false);
        setAlertOpen(true);
      }
    }
  };

  // const initializeCosmosClient = async () => {
  //   if (rpcUrls) {
  //     try {
  //       const chainId = chainIds || "cosmoshub-4";

  //       if (!window.keplr) {
  //         throw new Error("Keplr extension is not installed");
  //       }

  //       await window.keplr.enable(chainId);
  //       const offlineSigner = window.getOfflineSigner(chainId);
  //       const client = await SigningStargateClient.connectWithSigner(rpcUrls, offlineSigner);

  //       setCosmosClient(client);
  //     } catch (error) {
  //       console.error("Error initializing Cosmos client:", error);
  //     }
  //   }
  // };

  const initializeCosmosClient = async (chainId: string) => {
    if (rpcUrls) {
      try {
        if (!window.keplr) {
          throw new Error("Keplr extension is not installed");
        }

        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const client = await SigningStargateClient.connectWithSigner(rpcUrls, offlineSigner);

        setCosmosClient(client);
      } catch (error) {
        console.error("Error initializing Cosmos client:", error);
      }
    } else {
      alert("No RPC URL found. Please check your networks configuration.");
    }
  };

  // useEffect(() => {
  //   // initializeCosmosClient();
  // }, [networkDetails]);

  const web3 = new Web3(window.ethereum);

  const injectedContracts = contractDetails?.reduce((contracts, contract) => {
    if (contract.abi && contract.abi.length > 0) {
      // If ABI is directly provided, use it.
      contracts[contract.name] = {
        ...new web3.eth.Contract(contract.abi, contract.address),
        abi: contract.abi
      };
    } else if (contract.template) {
      const templateMap = {
        'ERC20': ERC20_ABI,
        'ERC721': ERC721_ABI,
        'ERC1155': ERC1155_ABI,
      };

      const contractPath = templateMap[contract.template];
      if (contractPath) {
        contracts[contract.name] = {
          ...new web3.eth.Contract(contract.abi, contract.address),
          abi: contractPath
        };
      } else {
        console.error(`No valid template found for contract: ${contract.template}`);
      }
    } else {
      console.error(`No ABI or template found for contract ${contract.name}`);
    }
    return contracts;
  }, {}) || {};

  const mcLib = {
    web3: web3,
    contracts: injectedContracts,
    cosmosClient: cosmosClient,
  };
  console.log(mcLib);

  useEffect(() => {
    console.log(mcLib);
  }, [networkDetails]);

  useEffect(() => {
    console.log(components);
    components.forEach((component) => {
      if (component.events) {
        component.events.forEach((event) => {
          if (event.event === "onLoad" && event.eventsCode) {
            executeOnLoadCode(event.eventsCode);
          }
        });
      }
    });
  }, [components]);

  const executeOnLoadCode = async (code) => {
    try {
      setLoading(true);
      const config = mcLib.web3.config;
      const ethers = mcLib.web3;
      console.log(config);
      const result = await eval(code);
      if (typeof result === "object") {
        setData((prevData) => ({ ...prevData, ...result }));
        debug((prevOutputCode) => ({ ...prevOutputCode, ...result }));
      }
    } catch (error) {
      console.error("Error executing onLoad code:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeOnChangeCode = async (code, data) => {
    try {
      setLoading(true);
      console.log("Executing onChange code:", code);
      const config = mcLib.web3.config;
      const ethers = mcLib.web3;
      const result = await eval(code);

      // Update state with the merged result
      setData(prevData => {
        const updatedData = { ...prevData, ...result };
        // console.log("updated-Data", updatedData);
        debug(updatedData);  // Pass updatedData to debug function
        return updatedData;
      });

    } catch (error) {
      console.error("Error executing onChange code:", error);
      debug(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, value: any, eventCode?: string, eventType?: string) => {
    setData((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));

    // console.log("handleInputChange Data:", id, value, eventCode, eventType);

    if (eventType === "onChange" && eventCode) {
      executeOnChangeCode(eventCode, { ...data, [id]: value });
    }
  };

  const handleRun = async (code: string, data: { [key: string]: string }) => {
    try {
      setLoading(true);
      const config = mcLib.web3.config;
      const ethers = mcLib.web3;
      console.log(config);
      const result = await eval(code);

      // Update state with the merged result
      setData(prevData => {
        // const updatedData = { ...prevData, ...result };
        const updatedData = { ...data, ...prevData, ...result };
        debug(updatedData);
        return updatedData;
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      debug(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // console.log("data", data);

  return (
    <>
      <div className="md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 py-3 shadow-md rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 mb-3 sm:mb-0">
            {isConnected ? (
              <span className="flex items-center text-green-600 dark:text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Connected to {selectedNetwork}
              </span>
            ) : (
              <span className="flex items-center text-red-600 dark:text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Not connected
              </span>
            )}
          </h2>
          <select
            className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleNetworkChange(e.target.value)}
            value={selectedNetwork || ""}
            title="Select Network"
          >
            <option value="" className="text-gray-400">
              Select network
            </option>
            {networkDetails.map((network) => (
              <option key={network.type} value={network.type} className="text-gray-800">
                {network.type}
              </option>
            ))}
          </select>
        </div>

        <ul className="whitespace-normal break-words lg:text-lg">
          {components.map((component, index) => (
            <li key={index} className="mb-4">
              {(component.placement === "input" ||
                component.placement === "output") && (
                  <div>
                    <label className="text-slate-500 font-semibold text-lg xl:text-xl">
                      {component.label}:
                    </label>
                  </div>
                )}

              {/* display the output data where developers/users want */}
              {component.placement === "output" && (
                <div key={component.id}>
                  {(() => {
                    switch (component.type) {
                      case "text":
                        // return <TextOutput data={data[component.id]} />;
                        <div
                          className="overflow-auto w-full bg-gray-100 overflow-x-auto rounded-lg"
                          style={{
                            ...(component.config && typeof component.config.styles === 'object'
                              ? component.config.styles
                              : {}),
                          }}
                        >
                          <TextOutput data={data[component.id]} />
                        </div>
                      case "json":
                        return (
                          <pre
                            className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto border border-gray-300 rounded-lg"
                            style={{
                              ...(component.config && typeof component.config.styles === 'object'
                                ? component.config.styles
                                : {}),
                            }}
                          >
                            {data[component.id]
                              ? `${component.id}: ${JSON.stringify(data[component.id], null, 2)}`
                              : ""}
                          </pre>
                        );
                      case "table":
                        // return <Table data={data[component.id]} />;
                        return (
                          <div
                            className="overflow-auto w-full bg-gray-100 overflow-x-auto rounded-lg"
                            style={{
                              ...(component.config && typeof component.config.styles === 'object'
                                ? component.config.styles
                                : {}),
                            }}
                          >
                            <Table data={data[component.id]} />
                          </div>
                        );
                      case "graph":
                        return (
                          <div style={{
                            ...(component.config && typeof component.config.styles === 'object'
                              ? component.config.styles
                              : {}),
                          }}
                          >
                            <Graph
                              key={`graph-${component.id}`}
                              output={data[component.id]}
                              configurations={
                                component.config.graphConfig
                              }
                              graphId={`graph-container-${component.id}`}
                            />
                          </div>
                        );
                      case "description":
                        return (
                          <div
                            className="overflow-auto w-full bg-gray-100 overflow-x-auto rounded-lg"
                            style={{
                              ...(component.config && typeof component.config.styles === 'object'
                                ? component.config.styles
                                : {}),
                            }}
                          >
                            <DescriptionComponent data={data[component.id]} />
                          </div>
                        );
                      case "transactionLink":
                        // console.log("Component:", component);
                        // console.log("Component.config:", component.config.transactionConfig);
                        // console.log("Component.config:", component.config.transactionConfig.type);
                        const preparedData = {
                          type: component.config.transactionConfig.type || "",
                          value: component.config.transactionConfig.value || "", 
                          baseUrl: component.config.transactionConfig.baseUrl || "https://etherscan.io",
                        };
                        return (
                          <div
                            className="overflow-auto w-full bg-gray-100 overflow-x-auto rounded-lg"
                            style={{
                              ...(component.config && typeof component.config.styles === 'object'
                                ? component.config.styles
                                : {}),
                            }}
                          >
                            <TransactionLink data={preparedData} />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              )}

              {component.placement === "input" &&
                (component.type === "text" ||
                  component.type === "number" ||
                  component.type === "file") && (
                  <input
                    className="w-full px-4  p-2 mt-1 border bg-slate-200 border-gray-300 rounded focus:outline-none"
                    style={{
                      ...(component.config && typeof component.config.styles === 'object'
                        ? component.config.styles
                        : {}),
                    }}
                    type={component.type}
                    id={component.id}
                    value={data[component.id] || ""}
                    onChange={(e) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, e.target.value, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, e.target.value);
                      });
                    }}
                  />
                )}
              {component.placement === "input" &&
                (component.type === "json") && (
                  <div
                    style={{
                      ...(component.config && typeof component.config.styles === 'object'
                        ? component.config.styles
                        : {}),
                    }}
                    id={component.id}
                  >
                    <JsonViewer
                      jsonData={data[component.id]}
                      setJsonData={(updatedData) => {
                        components.forEach((elements) => {
                          if (elements.events) {
                            elements.events.forEach((event) => {
                              if (event.event === "onChange") {
                                const eventCode = event.eventsCode;
                                handleInputChange(component.id, updatedData, eventCode, "onChange");
                              }
                            });
                          }
                          handleInputChange(component.id, updatedData);
                        });
                      }}
                    />
                  </div>
                )}
              {component.type === "swap" && (
                <div
                  className="mt-2"
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                >
                  <Swap
                    configurations={component.config.swapConfig}
                    onSwapChange={(swapData) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, swapData, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, swapData);
                      });
                    }}
                    data={data}
                  />
                </div>
              )}
              {component.type === "dropdown" && (
                <select
                  className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
                  id={component.id}
                  value={data[component.id]}
                  onChange={(e) => {
                    components.forEach((elements) => {
                      if (elements.events) {
                        elements.events.forEach((event) => {
                          if (event.event === "onChange") {
                            const eventCode = event.eventsCode;
                            handleInputChange(component.id, e.target.value, eventCode, "onChange");
                          }
                        });
                      }
                      handleInputChange(component.id, e.target.value);
                    });
                  }}
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                >
                  {component.config && component.config.optionsConfig && component.config.optionsConfig.values.map((option, idx) => (
                    <option key={idx} value={option.trim()}>
                      {option.trim()}
                    </option>
                  ))}
                </select>
              )}
              {component.type === "radio" && (
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
                  {component.config && component.config.optionsConfig &&
                    component.config
                      .optionsConfig.values.map((option, idx) => {
                        const optionWidth = option.trim().length * 8 + 48;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-shrink-0 items-center mr-2 md:mr-3 ${optionWidth > 200 ? "overflow-x-auto md:h-8" : ""
                              } h-7 md:w-[12.4rem] lg:w-[15rem] xl:w-[14.1rem] relative`}
                          >
                            <input
                              type="radio"
                              id={`${component.id}_${idx}`}
                              name={component.id}
                              value={option.trim()}
                              checked={data[component.id] === option}
                              onChange={(e) => {
                                components.forEach((elements) => {
                                  if (elements.events) {
                                    elements.events.forEach((event) => {
                                      if (event.event === "onChange") {
                                        const eventCode = event.eventsCode;
                                        handleInputChange(component.id, e.target.value, eventCode, "onChange");
                                      }
                                    });
                                  }
                                  handleInputChange(component.id, e.target.value);
                                });
                              }}
                              className="mr-2 absolute"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                            <label
                              htmlFor={`${component.id}_${idx}`}
                              className="whitespace-nowrap"
                              style={{ marginLeft: "1.5rem" }}
                            >
                              {option.trim()}
                            </label>
                          </div>
                        );
                      })}
                </div>
              )}
              {component.type === "checkbox" && (
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
                  {component.config && component.config.optionsConfig &&
                    component.config
                      .optionsConfig.values.map((option, idx) => {
                        const optionWidth = option.trim().length * 8 + 48;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-shrink-0 items-center mr-2 md:mr-3 ${optionWidth > 200 ? "overflow-x-auto md:h-8" : ""
                              } h-7 md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] relative`}
                          >
                            <input
                              type="checkbox"
                              id={`${component.id}_${idx}`}
                              checked={
                                data[component.id] &&
                                data[component.id].includes(option)
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentValue = data[component.id] || [];
                                const updatedValue = isChecked
                                  ? [...currentValue, option]
                                  : currentValue.filter(
                                    (item) => item !== option
                                  );
                                components.forEach((elements) => {
                                  if (elements.events) {
                                    elements.events.forEach((event) => {
                                      if (event.event === "onChange") {
                                        const eventCode = event.eventsCode;
                                        handleInputChange(component.id, updatedValue, eventCode, "onChange");
                                      }
                                    });
                                  }
                                  handleInputChange(component.id, updatedValue);
                                });
                              }}
                              className="mr-2 absolute"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                            <label
                              htmlFor={`${component.id}_${idx}`}
                              className="whitespace-nowrap"
                              style={{ marginLeft: "1.5rem" }}
                            >
                              {option.trim()}
                            </label>
                          </div>
                        );
                      })}
                </div>
              )}
              {component.type === "slider" && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id={component.id}
                      className="w-full h-8 cursor-pointer" //md:w-[60%]
                      name={component.label}
                      min={
                        component.config.sliderConfig
                          .interval.min
                      }
                      max={
                        component.config.sliderConfig
                          .interval.max
                      }
                      step={
                        component.config.sliderConfig
                          .step
                      }
                      value={
                        data[component.id] ||
                        component.config.sliderConfig
                          .value
                      }
                      onChange={(e) => {
                        console.log("components:", components);
                        components.forEach((elements) => {
                          if (elements.events) {
                            elements.events.forEach((event) => {
                              if (event.event === "onChange") {
                                const eventCode = event.eventsCode;
                                handleInputChange(component.id, e.target.value, eventCode, "onChange");
                              }
                            });
                          }
                          handleInputChange(component.id, e.target.value);
                        });
                      }}
                    />
                    <span className="font-semibold">
                      {data[component.id] ||
                        component.config.sliderConfig
                          .value}
                    </span>
                  </div>
                  {/* <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4 -4" />
                    </svg>
                    <span>Recommended: <strong className="text-blue-600">{component.config.sliderConfig.value}</strong></span>
                  </p> */}
                </div>
              )}
              {component.type === "walletDropdown" && (
                <div>
                  <Wallet
                    configurations={networkDetails}
                    onSelectAddress={(address) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, { address, balance: null }, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, { address, balance: null });
                      });
                    }}
                    onUpdateBalance={(balance) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, { address: data[component.id]?.address || "", balance }, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, { address: data[component.id]?.address || "", balance });
                      });
                    }}
                  />
                </div>
              )}
              {component.type === "button" && component.code && (
                <button
                  className="block px-4 p-2 mt-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                  id={component.id}
                  onClick={() => handleRun(component.code!, data)}
                >
                  {component.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {loading && <Loading />}
      {networkStatus !== `Connected to ${networkName}` && (
        <Alert
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          networkStatus={<span dangerouslySetInnerHTML={{ __html: networkStatus }} />}
          onSwitchNetwork={switchToSupportedNetwork}
        />
      )}
    </>
  );
};

export default App;

import React, { useState, useEffect } from "react";

interface DropdownConnectedWalletProps {
  configurations: any;
  onSelectAddress: (address: string) => void;
}

const DropdownConnectedWallet: React.FC<DropdownConnectedWalletProps> = ({
  configurations,
  onSelectAddress,
}) => {
  const [config, setConfig] = useState<any | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [ethBalance, setEthBalance] = useState<number | null>(null);
  const [minaBalance, setMinaBalance] = useState<number | null>(null);

  useEffect(() => {
    if (typeof configurations === "string") {
      try {
        setConfig(JSON.parse(configurations));
      } catch (error) {
        console.error("Error parsing configurations:", error);
      }
    } else if (typeof configurations === "object") {
      setConfig(configurations);
    } else {
      console.warn("Configurations are not a valid string or object.");
    }
  }, [configurations]);
  // console.log("configurations:-> ", config)

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const networkType = config?.network?.type?.toLowerCase();

        if (!networkType) {
          console.error("Network type not specified in configurations.");
          return;
        }

        let address = "";

        if (networkType === "ethereum" && window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          address = accounts[0];
          const ethBalance = await fetchEthBalance(address);
          setEthBalance(ethBalance);
        } else if (networkType === "mina" && window.mina) {
          const accounts = await window.mina.requestAccounts();
          address = accounts[0];
          const minaBalance = await fetchMinaBalance(address);
          setMinaBalance(minaBalance);
        } else {
          console.warn("No wallet detected for the specified network type.");
          address = "No supported wallet found for this network type.";
        }

        setSelectedAddress(address);
        onSelectAddress(address);

      } catch (error) {
        console.error("Error fetching user address:", error);
        setSelectedAddress("Error fetching address");
      }
    };

    if (config !== null) {
      fetchUserAddress();
    }
    

  }, [config]);

  const fetchEthBalance = async (address: string) => {
    const balanceResult = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
    console.log("Balance:", balanceResult + " wei");
    // Convert wei to decimal
    const wei = parseInt(balanceResult, 16);
    const balance = wei / 10 ** 18;
    console.log("Balance:", balance + " ETH");
    return balance;
  };

  const fetchMinaBalance = async (address: string) => {
    return 50;
  };

  return (
    <>
    <div>
      <select
      className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
      value={selectedAddress}
      // disabled={!selectedAddress}
      onChange={(e) => setSelectedAddress(e.target.value)}
    >
      <option value={selectedAddress}>{selectedAddress}</option>
    </select>
    </div>
    
    <div>Ethereum Balance: {ethBalance !== null ? `${ethBalance} ETH` : "Fetching balance..."}</div>
      <div>Mina Balance: {minaBalance !== null ? `${minaBalance} MINA` : "Fetching balance..."}</div>
    </>
  );
};

export default DropdownConnectedWallet;

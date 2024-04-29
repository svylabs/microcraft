import React, { useState, useEffect } from "react";

interface DropdownConnectedWalletProps {
  onSelectAddress: (address: string) => void;
}

const DropdownConnectedWallet: React.FC<DropdownConnectedWalletProps> = ({
  onSelectAddress,
}) => {
  const [metaMaskAddress, setMetaMaskAddress] = useState<string>("");
  const [auroWalletAddress, setAuroWalletAddress] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        // Fetch MetaMask address
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setMetaMaskAddress(accounts[0]);
          setSelectedAddress(accounts[0]);
          onSelectAddress(accounts[0]);
        } else {
          setMetaMaskAddress("MetaMask not detected");
          setSelectedAddress("MetaMask not detected");
        }

        // Fetch Auro Wallet address
        if (window.mina) {
          const accounts = await window.mina.requestAccounts();
          setAuroWalletAddress(accounts[0]);
          setSelectedAddress(accounts[0]);
          onSelectAddress(accounts[0]);
        } else {
          setAuroWalletAddress("Auro Wallet not detected");
          setSelectedAddress("Auro Wallet not detected");
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
        setMetaMaskAddress("Error fetching MetaMask address");
        setAuroWalletAddress("Error fetching Auro Wallet address");
        setSelectedAddress("Error fetching address");
      }
    };

    fetchUserAddress();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const address = event.target.value;
    setSelectedAddress(address);
    onSelectAddress(address);
  };

  return (
    <select
      className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
      value={selectedAddress}
      onChange={handleSelectChange}
    >
      <option value={metaMaskAddress}>{metaMaskAddress}</option>
      <option value={auroWalletAddress}>{auroWalletAddress}</option>
    </select>
  );
};

export default DropdownConnectedWallet;

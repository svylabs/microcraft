import React, { useState, useEffect } from "react";

interface DropdownConnectedWalletProps {
  onSelectAddress: (address: string) => void;
}

const DropdownConnectedWallet: React.FC<DropdownConnectedWalletProps> = ({
  onSelectAddress,
}) => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setUserAddress(accounts[0]);
          setSelectedAddress(accounts[0]);
          onSelectAddress(accounts[0]);
        } else {
          setUserAddress("MetaMask not detected");
          setSelectedAddress("MetaMask not detected");
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
        setUserAddress("Error fetching address");
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
      <option value={userAddress}>{userAddress}</option>
    </select>
  );
};

export default DropdownConnectedWallet;

import React, { useState, useEffect } from "react";

interface WalletBalanceProps {
  address: string;
  networkType: string;
  onUpdateBalance: any;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  address,
  networkType,
  onUpdateBalance,
}) => {
  const [ethBalance, setEthBalance] = useState<number | null>(null);
  const [minaBalance, setMinaBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (networkType === "ethereum") {
        const ethBalance = await fetchEthBalance(address);
        setEthBalance(ethBalance);
        onUpdateBalance(ethBalance);
      } else if (networkType === "mina") {
        const minaBalance = await fetchMinaBalance(address);
        setMinaBalance(minaBalance);
        onUpdateBalance(minaBalance);
      }
    };

    fetchBalances();
  }, [address, networkType]);

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
    // Implementation to fetch Mina balance
    return null;
  };

  return (
    <div className="flex justify-end items-center mt-2 text-gray-700 font-medium">
      {networkType === "ethereum" && (
        <>
          {ethBalance !== null
            ? `ETH Balance: ${ethBalance}`
            : "Fetching ETH balance..."}
        </>
      )}
      {networkType === "mina" && (
        <>
          {minaBalance !== null
            ? `MINA Balance: ${minaBalance}`
            : "Fetching MINA balance..."}
        </>
      )}
    </div>
  );
};

export default WalletBalance;

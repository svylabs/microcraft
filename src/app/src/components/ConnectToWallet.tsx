import React, { useState } from "react";
import Web3 from "web3";
import MetaMaskLogo from "./photos/metamask-icon.svg";
import ConnectWallet from "./photos/connect-wallet.svg";

interface MetamaskProps {}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectToWallet: React.FC<MetamaskProps> = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const handleConnectToWallet = () => {
    setShowWalletOptions(true);
  };

  const handleConnectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log("Account Address:", account);

        const balanceResult = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        console.log("Balance:", balanceResult + " wei");
        // Convert wei to decimal
        const wei = parseInt(balanceResult, 16);
        const balance = wei / 10 ** 18;
        console.log("Balance:", balance + " ETH");

        //Send transaction
        const amountToSend = "0.1"; // Amount in Ether
        const recipientAddress = "0x..."; // Recipient's Ethereum address
        const transactionParameters = {
          from: account,
          to: recipientAddress,
          value: Web3.utils.toWei(amountToSend, "ether"),
        };

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        console.log("Transaction sent:", txHash);
      } else {
        alert("Please install Metamask");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConnectToUniswap = async () => {
    // Uniswap wallet connection logic
  };

  return (
    // <div>
    //   <button
    //     onClick={handleConnectToMetaMask}
    //     className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md xl:text-xl p-3 md:px-6 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    //   >
    //     <img src={MetaMaskLogo} alt="MetaMask Logo" className="w-6 h-6 mr-2 " />{" "}
    //     Connect to Metamask
    //   </button>
    // </div>

    <div>
      <button
        onClick={handleConnectToWallet}
        className="common-button flex items-center justify-center cursor-pointer"
      >
        <img src={ConnectWallet} alt="MetaMask Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full p-2 bg-slate-100 hover:scale-110 shadow-lg " />
        {/* Connect */}
        <span className="absolute text-hover text-white font-medium mt-40 -ml-6 mx-2 lg:-ml-20  xl:-mx-10 bg-slate-500 p-1 rounded-md z-50">
              Connect to Wallet
            </span>
      </button>

      {showWalletOptions && (
        <div className="absolute z-10 top-16 right-0 w- bg-white border border-gray-200 rounded-md shadow-lg">
          <button
            onClick={handleConnectToMetaMask}
            className="flex items-center justify-center cursor-pointer bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md xl:text-xl p-1 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src={MetaMaskLogo}
              alt="MetaMask Logo"
              className="w-6 h-6 mr-2"
            />{" "}
            MetaMask
          </button>
          <button
            onClick={handleConnectToUniswap}
            className="flex items-center justify-start w-full px-4 py-2 hover:bg-gray-100"
          >
            {/* <img src={UniswapLogo} alt="Uniswap Logo" className="w-6 h-6 mr-2" />  */}
            Uniswap Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectToWallet;

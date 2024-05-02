import React, { useRef, useState, useEffect } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MetaMaskLogo from "./photos/metamask-icon.svg";
import ConnectWallet from "./photos/connect-wallet.svg";
import AuroLogo from "./photos/auro-wallet.png";

interface WalletProps {}

declare global {
  interface Window {
    ethereum?: any;
    mina?: any;
  }
}

const ConnectToWallet: React.FC<WalletProps> = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowWalletOptions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleConnectToWallet = () => {
    setShowWalletOptions((prevState) => !prevState);
  };

  const handleConnectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log("MetaMask Account Address:", account);

        const balanceResult = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        console.log("Balance:", balanceResult + " wei");
        // Convert wei to decimal
        const wei = parseInt(balanceResult, 16);
        const balance = wei / 10 ** 18;
        console.log("Balance:", balance + " ETH");

        toast.success("Successfully connected to MetaMask", {
          autoClose: 3000,
        });

        setShowWalletOptions(false);
      } else {
        alert("Please install Metamask.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to connect to MetaMask. Please try again.");
    }
  };

  const handleConnectToAuroWallet = async () => {
    try {
      if (window.mina) {
        const accounts = await window.mina.requestAccounts();
        const account = accounts[0];
        console.log("AuroWallet Account Address:", account);

        toast.success("Successfully connected to Auro Wallet", {
          autoClose: 3000,
        });
  
        setShowWalletOptions(false);
      } else {
        alert("Please install Auro Wallet.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to connect to Auro Wallet. Please try again.");
    }
  };

  return (
    <div ref={modalRef} className="z-50">
      <button
        onClick={handleConnectToWallet}
        className="common-button flex gap-3 text-lg items-center justify-center cursor-pointer"
        title="Connect to Wallet"
      >
        <img
          src={ConnectWallet}
          alt="MetaMask Logo"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full p-1.5 bg-slate-100 hover:scale-110 shadow-lg "
        />
        <span className="md:hidden">Connect to wallet</span>
      </button>

      {showWalletOptions && (
        <div className="flex flex-col gap-3 p-2 lg:p-3 lg:px-5 absolute z-10 md:top-16 lg:top-20 right-0 mr-3 md:mr-0 bg-white border border-gray-200 rounded-md shadow-lg">
          <button
            onClick={handleConnectToMetaMask}
            className="flex items-center cursor-pointer bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md xl:text-lg p-1.5 px-2 md:p-2 md:px-5 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src={MetaMaskLogo}
              alt="MetaMask Logo"
              className="w-6 h-6 mr-2"
            />{" "}
            MetaMask
          </button>
          <button
            onClick={handleConnectToAuroWallet}
            className="flex items-center cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-md xl:text-lg p-1.5 px-2 md:p-2 md:px-5 font-semibold text-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src={AuroLogo}
              alt="MetaMask Logo"
              className="w-6 h-6 mr-2"
            />{" "}
            Auro Wallet
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ConnectToWallet;

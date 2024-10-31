import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
// import Web3 from "web3";
import qs from "qs";
import TokensDropdown from "./TokensDropdown";
import { FiArrowDownCircle } from "react-icons/fi";
// const web3 = new Web3(Web3.givenProvider);

interface Props {
  configurations: any;
  onSwapChange: any;
  data: any;
}

const Swap: React.FC<Props> = ({ configurations, onSwapChange, data }) => {
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  // const [toAmount, setToAmount] = useState(data?.toAmount || "");
  const [toAmount, setToAmount] = useState("");

  // console.log("configurations", configurations);
  // console.log("WALLET-SWAP-data", data);
  // console.log("configurations?.estimatedAmountLabel", configurations?.estimatedAmountLabel);

  useEffect(() => {
    // Update toAmount based on data prop changes
    // if (data?.toAmount) {
    //   setToAmount(data.toAmount);
    // }

    const estimatedAmountKey = configurations?.estimatedAmountLabel;
    if (estimatedAmountKey && data && data[estimatedAmountKey]) {
      setToAmount(data[estimatedAmountKey]);
    }
  }, [configurations, data]);

  const selectToken = (side: string, token: any) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
    if (side === "from") setFromAmount("");
    if (side === "to") setToAmount("");
  };

  useEffect(() => {
    // const swapData = { from: currentTrade.from, to: currentTrade.to, fromAmount, toAmount };

    // Access swapConfig values using user-defined labels as IDs
    const swapData = {
      [configurations?.fromTokenLabel]: currentTrade.from,
      [configurations?.toTokenLabel]: currentTrade.to,
      [configurations?.amountLabel]: fromAmount,
      [configurations?.estimatedAmountLabel]: toAmount,
    };
    onSwapChange(swapData);
  }, [currentTrade.from, currentTrade.to, fromAmount, toAmount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
  };

  // console.log(tokens)
  // console.log(currentTrade);
  // console.log(currentTrade?.from?.address);
  // console.log(currentTrade?.to?.address);
  // console.log(fromAmount);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg shadow-lg p-6">
        <h4 className="text-lg lg:text-xl font-semibold mb-4 text-white text-center">{configurations?.heading}</h4>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.fromTokenLabel}</label>
            <TokensDropdown
              tokens={configurations.tokens}
              selectedToken={currentTrade.from}
              onSelect={(token) => selectToken("from", token)}
              blurToken={currentTrade.to}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.amountLabel}</label>
            <input
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="block w-full mt-1 border rounded py-2 px-3"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div className="flex justify-center my-2 text-white">
          <FiArrowDownCircle size={30} className="animate-bounce" />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.toTokenLabel}</label>
            <TokensDropdown
              tokens={configurations.tokens}
              selectedToken={currentTrade.to}
              onSelect={(token) => selectToken("to", token)}
              blurToken={currentTrade.from}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.estimatedAmountLabel}</label>
            <input
              type="text"
              value={toAmount}
              readOnly
              className="block w-full mt-1 border rounded py-2 px-3 bg-gray-100 text-indigo-700 cursor-not-allowed"
              placeholder="Estimated amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;

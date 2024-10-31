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
}

const Swap: React.FC<Props> = ({ configurations, onSwapChange }) => {
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  // const [gasEstimate, setGasEstimate] = useState<string>("");
  // const [isFetchingGas, setIsFetchingGas] = useState<boolean>(false);
  console.log(configurations);

  const selectToken = (side: string, token: any) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
    if (side === "from") setFromAmount("");
    if (side === "to") setToAmount("");

    // const swapData = { currentTrade: updatedTrade, fromAmount, toAmount };
    // onSwapChange(swapData);
    // getPrice();
  };

  // useEffect(() => {
  //   const swapData = { from: currentTrade.from, to: currentTrade.to, fromAmount, toAmount };
  //   onSwapChange(swapData);
  // }, [currentTrade, fromAmount, toAmount, onSwapChange]);

  useEffect(() => {
    const swapData = { from: currentTrade.from, to: currentTrade.to, fromAmount, toAmount };

    // Access swapConfig values using user-defined labels as IDs
    // const swapData = {
    //   [configurations?.fromTokenLabel]: currentTrade.from,
    //   [configurations?.toTokenLabel]: currentTrade.to,
    //   [configurations?.amountLabel]: fromAmount,
    //   [configurations?.estimatedAmountLabel]: toAmount,
    // };
    onSwapChange(swapData);
  }, [currentTrade.from, currentTrade.to, fromAmount, toAmount]);



  // const getPrice = async () => {
  //   console.log("Getting Price");
  //   if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

  //   const amount = Number(fromAmount) * 10 ** currentTrade.from.decimals;
  //   const params = {
  //     sellToken: currentTrade.from.address,
  //     buyToken: currentTrade.to.address,
  //     sellAmount: amount,
  //   };
  //   const headers = { "0x-api-key": "30f90dc0-b55f-4c5c-b616-762b109e2b60" };

  //   setIsFetchingGas(true);
  //   try {
  //     const response = await fetch(
  //       // `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
  //       `https://polygon.api.0x.org/swap/v1/price?${qs.stringify(params)}`,
  //       { headers }
  //     );
  //     const swapPriceJSON = await response.json();
  //     setToAmount(
  //       (swapPriceJSON.buyAmount / 10 ** currentTrade.to.decimals).toString()
  //     );
  //     setGasEstimate(swapPriceJSON.estimatedGas);
  //   } catch (error) {
  //     console.error("Error fetching price:", error);
  //   } finally {
  //     setIsFetchingGas(false);
  //   }
  // };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
    // getPrice();
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
        {/* <div className="">
          {isFetchingGas ? (
            <span className="block w-full mt-1 py-2 px-3 border rounded bg-gray-100">
              Fetching the best gas price...
            </span>
          ) : gasEstimate ? (
            <div>
              <label className="block text-gray-700">Estimated Gas</label>
            <span className="block w-full mt-1 py-2 px-3 border rounded bg-gray-100">
              {gasEstimate}
            </span>
            </div>
          ) : null}
        </div> */}
      </div>
    </div>
  );
};

export default Swap;

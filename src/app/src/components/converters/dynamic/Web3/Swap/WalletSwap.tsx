import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import qs from "qs";
import CustomDropdown from "./CustomDropdown";

const web3 = new Web3(Web3.givenProvider);

const Swap = () => {
  const [currentTrade, setCurrentTrade] = useState<{ [key: string]: any }>({});
  const [tokens, setTokens] = useState<any[]>([]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [gasEstimate, setGasEstimate] = useState<string>("");

  useEffect(() => {
    listAvailableTokens();
  }, []);

  const listAvailableTokens = async () => {
    try {
      const response = await fetch(
        "https://tokens.coingecko.com/uniswap/all.json"
      );
      const tokenListJSON = await response.json();
      setTokens(tokenListJSON.tokens);
    } catch (error) {
      console.error("Error fetching token list:", error);
    }
  };

  const selectToken = (side: string, token: any) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
    if (side === "from") setFromAmount("");
    if (side === "to") setToAmount("");
    getPrice();
  };

  const getPrice = async () => {
    console.log("Getting Price");
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const amount = Number(fromAmount) * 10 ** currentTrade.from.decimals;
    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: amount,
    };
    const headers = { "0x-api-key": "30f90dc0-b55f-4c5c-b616-762b109e2b60" };

    try {
      const response = await fetch(
        `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
        { headers }
      );
      const swapPriceJSON = await response.json();
      setToAmount(
        (swapPriceJSON.buyAmount / 10 ** currentTrade.to.decimals).toString()
      );
      setGasEstimate(swapPriceJSON.estimatedGas);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
    getPrice();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
        <h4 className="text-lg font-semibold mb-4">Swap</h4>
        <div className="flex justify-between">
          <div className="mb-4">
            <label className="block text-gray-700">From Token</label>
            <CustomDropdown
              tokens={tokens}
              selectedToken={currentTrade.from}
              onSelect={(token) => selectToken("from", token)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="block w-full mt-1 border rounded py-2 px-3"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="mb-4">
            <label className="block text-gray-700">To Token</label>
            <CustomDropdown
              tokens={tokens}
              selectedToken={currentTrade.to}
              onSelect={(token) => selectToken("to", token)}
              blurToken={currentTrade.from}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Estimated Amount</label>
            <input
              type="text"
              value={toAmount}
              readOnly
              className="block w-full mt-1 border rounded py-2 px-3"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Estimated Gas</label>
          <span className="block w-full mt-1 py-2 px-3 border rounded bg-gray-100">
            {gasEstimate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Swap;

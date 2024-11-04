import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
// import Web3 from "web3";
// import qs from "qs";
import TokensDropdown from "./TokensDropdown";
import { FiArrowDownCircle } from "react-icons/fi";
import Web3 from "web3";
// const web3 = new Web3(Web3.givenProvider);

interface Props {
  configurations: any;
  onSwapChange: any;
  data: any;
}

const Swap: React.FC<Props> = ({ configurations, onSwapChange, data }) => {

  const fromTokens = configurations.tokens.filter(token => 
    token.listType === "from" || token.listType === "both"
  );
  const toTokens = configurations.tokens.filter(token => 
    token.listType === "to" || token.listType === "both"
  );

  const defaultFromToken = fromTokens[0] || null; // Set to the first token in fromTokens as default
  const defaultToToken = toTokens[0] || null; // Set to the first token in toTokens as default

  // const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [currentTrade, setCurrentTrade] = useState({
    from: defaultFromToken,
    to: defaultToToken
  });
  const [fromAmount, setFromAmount] = useState("");
  // const [toAmount, setToAmount] = useState(data?.toAmount || "");
  const [toAmount, setToAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Initialize Web3 instance
  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    // const fetchBalance = async () => {
    //   try {
    //     if (!currentTrade.from || !currentTrade.from.address) return;

    //     const accounts = await web3.eth.getAccounts();
    //     if (accounts.length === 0) {
    //       console.warn("No user account found.");
    //       return;
    //     }
    //     const userAddress = accounts[0];

    //     let balance;

    //     if (currentTrade.from.isNative) {
    //       // Fetch balance for native token (e.g., ETH)
    //       balance = await web3.eth.getBalance(userAddress);
    //     } else {
    //       // Fetch balance for ERC20 token
    //       const tokenContract = new web3.eth.Contract(
    //         [
    //           {
    //             constant: true,
    //             inputs: [{ name: "_owner", type: "address" }],
    //             name: "balanceOf",
    //             outputs: [{ name: "balance", type: "uint256" }],
    //             type: "function",
    //           },
    //         ],
    //         currentTrade.from.address
    //       );

    //       // Validate that the address exists and fetch balance
    //       if (userAddress) {
    //         balance = await tokenContract.methods.balanceOf(userAddress).call();
    //       } else {
    //         console.warn("User address is undefined or invalid.");
    //         return;
    //       }
    //     }

    //     // Convert balance to a human-readable format
    //     setMaxAmount(web3.utils.fromWei(balance, "ether"));
    //   } catch (error) {
    //     console.error("Error fetching balance:", error);
    //     setMaxAmount("0");
    //   }
    // };



    const fetchBalance = async () => {
      try {
        // Ensure `from` token and address exist
        if (!currentTrade.from || !currentTrade.from.address) return;
    
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          console.warn("No user account found.");
          return;
        }
        const userAddress = accounts[0];
    
        let balance;
    
        if (currentTrade.from.isNative) {
          // Fetch balance for native token (e.g., ETH or BNB)
          balance = await web3.eth.getBalance(userAddress);
        } else {
          // Fetch balance for ERC20 token from token's contract
          const tokenContract = new web3.eth.Contract(
            [
              {
                constant: true,
                inputs: [{ name: "_owner", type: "address" }],
                name: "balanceOf",
                outputs: [{ name: "balance", type: "uint256" }],
                type: "function",
              },
            ],
            currentTrade.from.address
          );
    
          balance = await tokenContract.methods.balanceOf(userAddress).call();
        }
    
        // Convert balance to readable format
        setMaxAmount(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setMaxAmount("0");
      }
    };
    

    fetchBalance();
  }, [currentTrade.from]);

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

  const selectToken = (side, token) => {
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

  // const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFromAmount(e.target.value);
  // };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;

    // Prevent the user from entering an amount greater than the max balance
    if (new BigNumber(inputAmount).isLessThanOrEqualTo(new BigNumber(maxAmount))) {
      setFromAmount(inputAmount);
    } else {
      // Optionally notify the user
      alert(`Amount exceeds your balance of ${maxAmount}`);
    }
  };

  // console.log(tokens)
  // console.log(currentTrade);
  // console.log(currentTrade?.from?.address);
  // console.log(currentTrade?.to?.address);
  // console.log(fromAmount);

  return (
    <div className="container mx-auto py-4">
      <div className="max-w-xl mx-auto bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg shadow-lg p-6">
        <h4 className="text-lg lg:text-xl font-semibold mb-4 text-white text-center">{configurations?.heading}</h4>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.fromTokenLabel}</label>
            <TokensDropdown
              // tokens={configurations.tokens}
              tokens={fromTokens}
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
              max={maxAmount}
            />
            <span className="text-gray-400 text-sm mt-1 block">
              Max amount: {maxAmount}
            </span>
          </div>
        </div>
        <div className="flex justify-center text-white">
          <FiArrowDownCircle size={30} className="animate-bounce" />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-100">{configurations?.toTokenLabel}</label>
            <TokensDropdown
              // tokens={configurations.tokens}
              tokens={toTokens}
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

async function fetchERC20Balance() {
    console.log("mcLib;- ", mcLib);
    // mcLib is injected by the framework.
    const contractAddress = data.erc20AddressInput || mcLib.contracts.ERC20._address;

    // ABI for the ERC20 contract
    const abi = [
        {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
                {
                    name: "",
                    type: "uint256"
                }
            ],
            payable: false,
            stateMutability: "view",
            type: "function"
        }
    ];

    // Create a contract instance with the ABI and contract address
    // const contract = new mcLib.web3.eth.Contract(abi, contractAddress);
    const contract = new mcLib.web3.eth.Contract(abi, contractAddress);

    // Call the totalSupply function from the contract
    const totalSupply = await contract.methods.totalSupply().call();

    let lusdTotal = mcLib.web3.utils.fromWei(totalSupply, 'ether');
    console.log('Total LUSD in circulation:', lusdTotal);

    return { lusdTotal };
}

// Fetch the ERC20 balance
fetchERC20Balance();

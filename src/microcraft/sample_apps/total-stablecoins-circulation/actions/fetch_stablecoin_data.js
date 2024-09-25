async function fetchStablecoinData() {
    try {
        // Check if a custom ERC20 address was entered, otherwise use the dropdown selection
        const customAddress = data.erc20AddressInput;
        const selectedAddress = data.stablecoinSelect;

        // Determine the contract address to use
        const contractAddress = customAddress && mcLib.web3.utils.isAddress(customAddress)
            ? customAddress
            : selectedAddress;

        if (!contractAddress || !mcLib.web3.utils.isAddress(contractAddress)) {
            alert('Please select a valid stablecoin or enter a valid ERC20 contract address.');
            throw new Error('Invalid stablecoin selection or contract address');
        }

        const abi = mcLib.contracts.DAI.abi;  // Assuming all stablecoins use the ERC20 ABI

        // Create contract instance
        const contract = new mcLib.web3.eth.Contract(abi, contractAddress);

        // Fetch total supply, name, and symbol
        const totalSupply = await contract.methods.totalSupply().call();
        const formattedTotalSupply = mcLib.web3.utils.fromWei(totalSupply, 'ether');
        const humanReadableTotalSupply = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(formattedTotalSupply);
        

        const tokenName = await contract.methods.name().call();
        const tokenSymbol = await contract.methods.symbol().call();

        // Update UI with the fetched data
        data.erc20TotalSupply = humanReadableTotalSupply;
        data.erc20Name = tokenName;
        data.erc20Symbol = tokenSymbol;

        console.log(`Total ${tokenSymbol} Supply: ${humanReadableTotalSupply}`);
        console.log(`${tokenSymbol} Token Name: ${tokenName}`);

        return {
            erc20TotalSupply: humanReadableTotalSupply,
            erc20Name: tokenName,
            erc20Symbol: tokenSymbol
        };

    } catch (error) {
        console.error('Error fetching stablecoin data:', error.message);
        return { error: error.message };
    }
}

fetchStablecoinData();

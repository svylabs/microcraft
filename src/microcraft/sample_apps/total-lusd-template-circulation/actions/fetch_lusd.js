async function fetchERC20Data() {
    try {
        // mcLib is injected by the framework.
        const contractAddress = data.erc20AddressInput || mcLib.contracts.ERC20._address;
        const userAddress = data.walletAddressInput || mcLib.userAddress;
        const abi = mcLib.contracts.ERC20.abi;

        // Validate input
        if (!mcLib.web3.utils.isAddress(contractAddress)) {
            alert('Invalid ERC20 contract address');
            throw new Error('Invalid ERC20 contract address');
        }
        if (!mcLib.web3.utils.isAddress(userAddress)) {
            alert('Invalid wallet address');
            throw new Error('Invalid wallet address');
        }

        // Create contract instance
        const contract = new mcLib.web3.eth.Contract(abi, contractAddress);

        // Fetch total supply
        const totalSupply = await contract.methods.totalSupply().call();
        const formattedTotalSupply = mcLib.web3.utils.fromWei(totalSupply, 'ether');

        // Fetch token name and symbol
        const tokenName = await contract.methods.name().call();
        const tokenSymbol = await contract.methods.symbol().call();

        // Fetch user's balance
        const userBalance = await contract.methods.balanceOf(userAddress).call();
        const formattedUserBalance = mcLib.web3.utils.fromWei(userBalance, 'ether');

        // Update UI with the fetched data
        data.erc20TotalSupply = formattedTotalSupply;
        data.erc20Name = tokenName;
        data.erc20Symbol = tokenSymbol;
        data.erc20UserBalance = formattedUserBalance;

        console.log(`Total ${tokenSymbol} Supply: ${formattedTotalSupply}`);
        console.log(`${tokenSymbol} Token Name: ${tokenName}`);
        console.log(`${userAddress}'s ${tokenSymbol} Balance: ${formattedUserBalance}`);

        return {
            erc20TotalSupply: formattedTotalSupply,
            erc20Name: tokenName,
            erc20Symbol: tokenSymbol,
            erc20UserBalance: formattedUserBalance
        };

    } catch (error) {
        console.error('Error fetching ERC20 data:', error.message);
        return { error: error.message };
    }
}

fetchERC20Data();

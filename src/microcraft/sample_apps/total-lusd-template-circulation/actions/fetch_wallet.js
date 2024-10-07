async function fetchWallet() {
    try {
        // mcLib is injected by the framework.
        const contractAddress = data.erc20AddressInput || mcLib.contracts.ERC20._address;
        const userAddress = data.walletAddressInput || data.walletAddressSelect.address;
        const abi = mcLib.contracts.ERC20.abi;

        // Validate input
        if (!mcLib.web3.utils.isAddress(contractAddress)) {
            alert('Invalid ERC20 contract address');
            throw new Error('Invalid ERC20 contract address');
        }
        if (!mcLib.web3.utils.isAddress(userAddress)) {
            alert('Enter a valid wallet address');
            throw new Error('Invalid wallet address');
        }

        // Create contract instance
        const contract = new mcLib.web3.eth.Contract(abi, contractAddress);

        // Fetch user's balance
        const userBalance = await contract.methods.balanceOf(userAddress).call();
        const formattedUserBalance = mcLib.web3.utils.fromWei(userBalance, 'ether');
        data.erc20UserBalance = formattedUserBalance;

        console.log(`${userAddress}'s ${tokenSymbol} Balance: ${formattedUserBalance}`);

        return {
            erc20UserBalance: formattedUserBalance
        };

    } catch (error) {
        console.error('Error fetching ERC20 data:', error.message);
        return { error: error.message };
    }
}

fetchWallet();

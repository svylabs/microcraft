import React from 'react';
import Web3 from 'web3';

interface MetamaskProps {}

declare global {
    interface Window {
      ethereum?: any;
    }
  }
  

const Metamask: React.FC<MetamaskProps> = () => {
  const web3MetaOpen = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log(account);

        const balanceResult = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });

        console.log(balanceResult);

        // Convert wei to decimal
        const wei = parseInt(balanceResult, 16);
        const balance = wei / 10 ** 18;
        console.log('Balance:', balance + ' ETH');

        // Send transaction
        // const amountToSend = "0.1"; // Amount in Ether
        // const recipientAddress = "0x..."; // Recipient's Ethereum address
        // const transactionParameters = {
        //   from: account,
        //   to: recipientAddress,
        //   value: Web3.utils.toWei(amountToSend, "ether"),
        // };

        // const txHash = await window.ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [transactionParameters],
        // });
        // console.log("Transaction sent:", txHash);
      } else {
        alert('Please install Metamask');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button className='border p-1 px-2' id="connect-button" onClick={web3MetaOpen}>
        Connect Metamask
      </button>
    </div>
  );
};

export default Metamask;

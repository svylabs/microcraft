import React from 'react';

interface TransactionLinkProps {
  txHash: string;
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ txHash }) => {
  const etherscanUrl = `https://etherscan.io/tx/${txHash}`;

  return (
    <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
      {txHash.slice(0, 10)}...
    </a>
  );
};

export default TransactionLink;

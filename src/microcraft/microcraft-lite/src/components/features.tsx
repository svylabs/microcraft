import React from 'react';

const featuresList = [
  {
    title: 'Decentralized DeFi Frontends',
    description: 'The framework enables this.',
  },
  {
    title: 'JSON UI Definitions',
    description: 'Users can create UIs through simple JSON-based configuration.',
  },
  {
    title: 'Github / IPFS Storage',
    description: 'UIs can be stored as JSON files in GitHub/IPFS, and the framework renders the UI directly without any hosting.',
  },
  {
    title: 'Inbuilt Web3/HTML Components',
    description: 'Pre-built components for text, wallet, swap, etc.',
  },
  {
    title: 'Easy Integration with Smart Contracts/Networks',
    description: 'Support for EVM-based smart contracts, with more VMs planned.',
  },
  {
    title: 'Wallet Integrations',
    description: 'Metamask integration.',
  },
  {
    title: 'Account Abstraction',
    description: 'Efficient and seamless account abstraction mechanisms.',
  },
];

const Features: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Features
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Discover the unique features offered by our framework for building robust DeFi UIs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {feature.title}
              </h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

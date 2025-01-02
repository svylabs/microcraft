import React, { useState, useRef, useEffect } from 'react';

const featuresList = [
  {
    title: 'Decentralized DeFi Frontends',
    description:
      'The framework enables this. Lorem ipsum dolor sit amet consectetur, adipisicing elit. In perferendis, repellendus fugiat nobis tempore beatae odit magni. Aut nesciunt ad modi quam, error tenetur laudantium cupiditate explicabo. Quas, totam fugiat? Text messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, asText messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, as',
  },
  {
    title: 'JSON UI Definitions',
    description: 'Users can create UIs through simple JSON-based configuration.',
  },
  {
    title: 'Github / IPFS Storage',
    description:
      'UIs can be stored as JSON files in GitHub/IPFS, and the framework renders the UI directly without any hosting.',
  },
  {
    title: 'Inbuilt Web3/HTML Components',
    description: 'Pre-built components for text, wallet, swap, etc.',
  },
  {
    title: 'Easy Integration with Smart Contracts/Networks',
    description:
      'Support for EVM-based smart contracts, with more VMs planned.',
  },
  {
    title: 'Wallet Integrations',
    description: 'Metamask integration.Text messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, asText messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, asText messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, asText messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, asText messages are used for personal, family, business, and social purposes. Governmental and non-governmental organizations use text messaging for communication between colleagues. In the 2010s, the sending of short informal messages became an accepted part of many cultures, as',
  },
  {
    title: 'Account Abstraction',
    description:
      'Efficient and seamless account abstraction mechanisms.',
  },
];

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Features: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = (feature: { title: string; description: string }) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFeature(null);
    setIsModalOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedFeature?.title}
            </h2>
            <p className="text-gray-600 max-h-80 overflow-y-auto">
              {selectedFeature?.description}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-10">
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
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              onClick={() => openModal(feature)}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2 hover:text-indigo-600">
                {feature.title}
              </h2>
              <p className="text-gray-600">
                {truncateText(feature.description, 100)}{' '}
                <span className="text-indigo-600 font-medium">Read More</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

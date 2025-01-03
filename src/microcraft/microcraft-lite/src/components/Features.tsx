import React, { useState, useRef, useEffect } from 'react';

const featuresList = [
  {
    title: 'Opinionated framework for DeFi micro-frontends',
    description:
      'Microcraft is an opinionated framework for DeFi frontend development, providing a set of tools and conventions to make building DeFi frontends easy.',
  },
  {
    title: 'JSON based micro-frontend definition',
    description: 'Developers and non-technical users alike can create Micro-frontends using intuitive JSON definition',
  },
  {
    title: 'Compartmentalized execution & Security',
    description:
      'microcraft-lib (npm: @svylabs/microcraft-lib), the library that powers Microcraft executes frontend code in a secure compartmentalized environment, ensuring that the frontend execution is secure, with no accessibility to localStorage, cookies etc.',
  },
  {
    title: 'Render from Github / IPFS',
    description:
      'UI definitions can be stored in Github or IPFS and be rendered directly by the framework with appropriate runtime implementations',
  },
  {
    title: 'Smart Contracts and Network integration',
    description:
      'Microcraft provides seamless integration with EVM based networks and smart contracts, with more networks coming soon',
  },
  {
    title: 'Wallet Integrations',
    description: 'Microcraft supports Metamask with more integrations coming soon.',
  },
  {
    title: "CLI to build and test",
    description: "The microcraft CLI (npm install -g @svylabs/microcraft) helps developers build and test the frontends locally before publishing to the internet."
  },
  {
    title: "Coming soon: WASM library support",
    description: "Inject WASM libraries into microfrontends to build custom functionality"
  }
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
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
          Packed with features to make DeFi frontends secure and easy to build.
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

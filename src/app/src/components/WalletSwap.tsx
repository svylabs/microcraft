import React, { useState } from 'react';

const WalletSwap: React.FC = () => {
  const availableTokens = ['BTC', 'ETH', 'USDT', 'BNB'];
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [fromToken, setFromToken] = useState(availableTokens[0]);
  const [toToken, setToToken] = useState(availableTokens[1]);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSwap = async () => {
    if (amount === null || amount <= 0) {
      setMessage('Amount must be greater than zero');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log(`Swapping ${amount} ${fromToken} from ${fromWallet} to ${toWallet} in ${toToken}`);
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage('Swap successful!');
    } catch (error) {
      setMessage('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Wallet Swap</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSwap();
        }}
        className="space-y-4"
      >
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">From Wallet</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">To Wallet</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">From Token</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            required
          >
            {availableTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">To Token</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            required
          >
            {availableTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={amount !== null ? amount : ''}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
            required
          />
        </div>
        {message && (
          <div
            className={`mt-4 p-2 text-center rounded ${
              message.includes('successful')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-gray-400'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
          disabled={loading}
        >
          {loading ? 'Swapping...' : 'Swap'}
        </button>
      </form>
    </div>
  );
};

export default WalletSwap;

import React, { useState } from 'react';

const WalletSwap: React.FC = () => {
  const availableTokens = ['BTC', 'ETH', 'USDT', 'BNB'];
  const wallets = [
    { name: 'Wallet1', balance: 5, icon: '🔹' },
    { name: 'Wallet2', balance: 10, icon: '🔸' },
  ];

  const [fromWallet, setFromWallet] = useState(wallets[0]);
  const [toWallet, setToWallet] = useState(wallets[1]);
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

    if (amount > fromWallet.balance) {
      setMessage('Insufficient balance');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log(`Swapping ${amount} ${fromToken} from ${fromWallet.name} to ${toWallet.name} in ${toToken}`);
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage('Swap successful!');
    } catch (error) {
      setMessage('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapClick = () => {
    // Swap logic
    const tempWallet = fromWallet;
    setFromWallet(toWallet);
    setToWallet(tempWallet);
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
          <div className="flex items-center">
            <select
              className="mr-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={fromWallet.name}
              onChange={(e) => {
                const selectedWallet = wallets.find(wallet => wallet.name === e.target.value);
                if (selectedWallet) {
                  setFromWallet(selectedWallet);
                }
              }}
            >
              {wallets.map(wallet => (
                <option key={wallet.name} value={wallet.name}>
                  {wallet.icon} {wallet.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={amount !== null ? amount : ''}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
              required
            />
          </div>
          <div className="flex justify-end mt-2 text-sm text-gray-600">Balance: {fromWallet.balance} {fromToken}</div>
        </div>
        <div className='flex justify-center'>
        <button
            type="button"
            onClick={handleSwapClick}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title='swap'
          >
            {/* Swap Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M10.293 7.707a1 1 0 0 1 0-1.414l3-3a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0"/><path d="M17.707 7.707a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414"/><path d="M14 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1m-4.293 7.293a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0"/><path d="M2.293 12.293a1 1 0 0 1 1.414 0l3 3a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414"/><path d="M6 15a1 1 0 0 1-1-1V6a1 1 0 1 1 2 0v8a1 1 0 0 1-1 1"/></g></svg>
          </button>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">To Wallet</label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={toWallet.name}
            onChange={(e) => {
              const selectedWallet = wallets.find(wallet => wallet.name === e.target.value);
              if (selectedWallet) {
                setToWallet(selectedWallet);
              }
            }}
          >
            {wallets.map(wallet => (
              <option key={wallet.name} value={wallet.name}>
                {wallet.icon} {wallet.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">From Token</label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            required
          >
            {availableTokens.map(token => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">To Token</label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            required
          >
            {availableTokens.map(token => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div> */}
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

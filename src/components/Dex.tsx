import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  balance: string;
}

const mockTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', logo: '🌐', balance: '1.2345' },
  { symbol: 'USDT', name: 'Tether', logo: '💵', balance: '1000.00' },
  { symbol: 'USDC', name: 'USD Coin', logo: '💵', balance: '500.00' },
];

export function Dex() {
  const [fromToken, setFromToken] = useState<Token>(mockTokens[0]);
  const [toToken, setToToken] = useState<Token>(mockTokens[1]);
  const [amount, setAmount] = useState<string>('');
  const [isFromTokenSelectOpen, setIsFromTokenSelectOpen] = useState(false);
  const [isToTokenSelectOpen, setIsToTokenSelectOpen] = useState(false);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className='max-w-md mx-auto bg-background-light dark:bg-background-dark rounded-xl shadow-lg p-6'>
      {/* From Token */}
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>From</label>
        <div className='relative'>
          <div
            className='flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer'
            onClick={() => setIsFromTokenSelectOpen(!isFromTokenSelectOpen)}
          >
            <div className='flex items-center space-x-2'>
              <span className='text-xl'>{fromToken.logo}</span>
              <span className='font-medium'>{fromToken.symbol}</span>
            </div>
            <ChevronDownIcon className='w-5 h-5' />
          </div>
          {isFromTokenSelectOpen && (
            <div className='absolute z-10 w-full mt-1 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'>
              {mockTokens.map((token) => (
                <div
                  key={token.symbol}
                  className='flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                  onClick={() => {
                    setFromToken(token);
                    setIsFromTokenSelectOpen(false);
                  }}
                >
                  <div className='flex items-center space-x-2'>
                    <span className='text-xl'>{token.logo}</span>
                    <span>{token.symbol}</span>
                  </div>
                  <span className='text-sm text-gray-500'>{token.balance}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='0.0'
          className='w-full mt-2 p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
        />
      </div>

      {/* Swap Button */}
      <div className='flex justify-center my-2'>
        <button
          onClick={handleSwapTokens}
          className='p-2 rounded-full bg-primary text-white hover:bg-primary/90'
        >
          ↓
        </button>
      </div>

      {/* To Token */}
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>To</label>
        <div className='relative'>
          <div
            className='flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer'
            onClick={() => setIsToTokenSelectOpen(!isToTokenSelectOpen)}
          >
            <div className='flex items-center space-x-2'>
              <span className='text-xl'>{toToken.logo}</span>
              <span className='font-medium'>{toToken.symbol}</span>
            </div>
            <ChevronDownIcon className='w-5 h-5' />
          </div>
          {isToTokenSelectOpen && (
            <div className='absolute z-10 w-full mt-1 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'>
              {mockTokens.map((token) => (
                <div
                  key={token.symbol}
                  className='flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                  onClick={() => {
                    setToToken(token);
                    setIsToTokenSelectOpen(false);
                  }}
                >
                  <div className='flex items-center space-x-2'>
                    <span className='text-xl'>{token.logo}</span>
                    <span>{token.symbol}</span>
                  </div>
                  <span className='text-sm text-gray-500'>{token.balance}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='w-full mt-2 p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md'>
          {amount ? (Number(amount) * 1.5).toFixed(6) : '0.0'}
        </div>
      </div>

      {/* Price Info */}
      <div className='mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
        <div className='flex justify-between text-sm mb-2'>
          <span className='text-gray-500'>Price Impact</span>
          <span className='text-warning-weak-light dark:text-warning-weak-dark'>-0.5%</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Network Fee</span>
          <span>~$0.50</span>
        </div>
      </div>

      {/* Swap Button */}
      <button className='w-full btn-primary py-3 text-lg font-medium rounded-lg'>Swap</button>
    </div>
  );
}

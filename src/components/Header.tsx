import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <img src='/logo.svg' alt='DEX Logo' className='h-8 w-8' />
          <span className='text-xl font-bold'>DEX App</span>
        </Link>

        {/* Wallet Connect Button */}
        <ConnectButton />
      </div>
    </header>
  );
}

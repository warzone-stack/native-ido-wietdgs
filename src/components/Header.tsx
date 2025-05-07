import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils';

export function Header() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <header>
      <div className='container mx-auto px-10 h-[68px] flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <img src='/logo.png' alt='DEX Logo' className='h-[46px] w-[126px]' />
        </Link>

        {/* Wallet Connect Button and Theme Toggle */}
        <div className='flex items-center space-x-2'>
          <button
            onClick={connected ? disconnect : () => setVisible(true)}
            className='flex items-center justify-center gap-2 px-3 py-1.5 rounded-[40px] bg-white dark:bg-background-dark'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M6 8.80002C4.89543 8.80002 4 9.69545 4 10.8V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10.8C20 9.69545 19.1046 8.80002 18 8.80002H6ZM15.1998 12.8C14.3162 12.8 13.5998 13.5163 13.5998 14.4C13.5998 15.2836 14.3162 16 15.1998 16H19.9998V12.8H15.1998Z'
                fill='currentColor'
              />
              <ellipse cx='15.2001' cy='14.4' rx='0.8' ry='0.8' fill='currentColor' />
              <path
                d='M12.8122 4.70557C13.7228 4.30087 14.7923 4.6282 15.3205 5.47319L16.3997 7.2H7.19971L12.8122 4.70557Z'
                fill='currentColor'
              />
            </svg>

            <span className='text-black dark:text-white'>
              {connected ? shortenAddress(publicKey?.toBase58() ?? '') : 'Not Connected'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

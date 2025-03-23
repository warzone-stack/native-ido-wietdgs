import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <img src='/logo.svg' alt='DEX Logo' className='h-8 w-8' />
          <span className='text-xl font-bold'>DEX App</span>
        </Link>

        {/* Wallet Connect Button and Theme Toggle */}
        <div className='flex items-center space-x-2'>
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openChainModal, openAccountModal }) => {
              const connected = account && chain;
              return (
                <button
                  onClick={connected ? openAccountModal : openConnectModal}
                  className='flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
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
                    {connected ? account.displayName : 'Not Connected'}
                  </span>
                </button>
              );
            }}
          </ConnectButton.Custom>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className='p-2 rounded-lg bg-primary text-white hover:bg-primary/90'
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5'
              >
                <path d='M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5'
              >
                <path
                  fillRule='evenodd'
                  d='M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

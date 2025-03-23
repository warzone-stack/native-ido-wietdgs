import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { ThemeProvider } from 'next-themes';
import { Dex } from './components/Dex';

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <div className='min-h-screen p-4'>
            <button
              onClick={toggleTheme}
              className='fixed top-4 right-4 p-2 rounded-lg bg-primary text-white hover:bg-primary/90'
            >
              {isDark ? '🌞' : '🌙'}
            </button>
            <div className='container mx-auto'>
              <h1 className='text-4xl font-bold text-center mb-8'>DEX App</h1>
              <Dex />
            </div>
          </div>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default App;

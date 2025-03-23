import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { ThemeProvider, useTheme } from 'next-themes';
import { Header } from './components/Header';
import { Ido } from './components/Ido';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppContent() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />
      <main>
        <button
          onClick={toggleTheme}
          className='fixed top-20 right-4 p-2 rounded-lg bg-primary text-white hover:bg-primary/90'
        >
          {isDark ? '🌞' : '🌙'}
        </button>
        <Ido />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <ThemeProvider attribute='class' defaultTheme='light'>
            <AppContent />
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;

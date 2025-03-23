import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { Ido } from './components/Ido';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className='min-h-screen'>
      <Header />
      <main className='pt-16 px-5 mt-5 pb-10'>
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

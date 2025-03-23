import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useAccount, WagmiProvider } from 'wagmi';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import { config } from './config/wagmi';

const queryClient = new QueryClient();

function AppContent() {
  const { address } = useAccount();

  return (
    <div className='min-h-screen'>
      <Header />
      <main className='pt-16 px-5 mt-5 pb-10'>
        <div className='max-w-[560px] 2xl:max-w-[720px] min-h-[776px] mx-auto bg-white dark:bg-background-dark rounded-xl p-5 flex flex-col gap-7 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] dark:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)]'>
          <div className='w-full min-h-[120px] rounded-lg bg-[--primary] opacity-20 p-5 flex flex-col items-start gap-7'>
            {address}
          </div>

          <Countdown endTime={new Date(Date.now() + 1000 * 60 * 60 * 24)} />

          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              return (() => {
                if (!mounted || !account || !chain) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className='w-full min-h-10 btn-primary text-base font-semibold'
                    >
                      Connect with OKX Wallet
                    </button>
                  );
                }
                return null;
              })();
            }}
          </ConnectButton.Custom>
        </div>
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

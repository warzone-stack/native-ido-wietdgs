import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { formatUnits } from 'viem/utils';
import { useAccount, WagmiProvider } from 'wagmi';
import { ChainSwitcher } from './components/ChainSwitcher';
import { ConnectOKXButton } from './components/ConnectButton';
import { ContractInfo } from './components/ContractInfo';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import { MinDepositAmounts } from './components/MinDepositAmounts';
import { TokenLogo } from './components/TokenLogo';
import { SOCIAL_LINKS } from './config/site';
import { config } from './config/wagmi';
import { isOKXWallet } from './config/web3';
import { useContractInfo } from './hooks/useContractInfo';

const queryClient = new QueryClient();

function AppContent() {
  const { address } = useAccount();
  const contractInfo = useContractInfo();

  // Calculate sale duration in hours
  const saleDuration =
    contractInfo.startTimestamp && contractInfo.endTimestamp
      ? Number(contractInfo.endTimestamp - contractInfo.startTimestamp) / 3600
      : undefined;

  const isOKX = isOKXWallet();
  return (
    <div className='min-h-screen'>
      <Header />
      <main className='pt-16 px-5 mt-5 pb-10'>
        <div className='max-w-[560px] 2xl:max-w-[720px] min-h-[776px] mx-auto bg-white dark:bg-background-dark rounded-xl p-5 flex flex-col gap-7 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] dark:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)]'>
          <div className='w-full min-h-[120px] rounded-lg bg-[--primary] opacity-20 p-5 flex flex-col items-start gap-7'>
            {address}
          </div>

          <ChainSwitcher />

          {contractInfo.endTimestamp && (
            <Countdown endTime={new Date(Number(contractInfo.endTimestamp) * 1000)} />
          )}

          {contractInfo.status === 'not_started' && <ConnectOKXButton />}

          {contractInfo.status === 'in_progress' && (
            <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
              <div className='opacity-50'>Total Offering</div>
              <div className='flex gap-1 gap-[10px] items-center'>
                <TokenLogo />
              </div>
            </div>
          )}

          {contractInfo.status === 'ended' && (
            <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
              <div className='opacity-50'>Total Offering</div>
              <div className='flex gap-1 gap-[10px] items-center'>
                <TokenLogo />
              </div>
            </div>
          )}

          <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
            <div className='opacity-50'>Total Offering</div>
            <div className='flex gap-1 gap-[10px] items-center'>
              <TokenLogo />
              <div className='text-3xl font-semibold'>
                {!isOKX
                  ? '???'
                  : contractInfo.totalTokensOffered && contractInfo.offeringToken
                    ? formatUnits(
                        contractInfo.totalTokensOffered,
                        contractInfo.offeringToken.decimals
                      )
                    : '-'}
                &nbsp;
                {contractInfo.offeringToken?.symbol ?? ''}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm opacity-50'>Sale Duration</h3>
              <p className='text-base font-medium'>
                {saleDuration ? `${saleDuration} hours` : 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-5 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => {
                  //
                }}
                className='w-full min-h-14 btn-primary font-semibold'
              >
                How to Participate
              </button>
              <button
                onClick={() => {
                  //
                }}
                className='w-full min-h-14 btn-bordered text-base font-semibold'
              >
                Campaign Details
              </button>
            </div>
            <div className='text-xs opacity-50'>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                with desktop publishing software like Aldus PageMaker including versions of Lorem
                Ipsum.
              </p>
              <p>1Footnote one, yey.</p>
              <p>2Footnote two, bla bla lbaba.</p>
            </div>

            <div className='flex items-center gap-2'>
              {SOCIAL_LINKS.map((link) => (
                <a
                  href={link.url}
                  key={link.name}
                  className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {link.ICON}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContractInfo {...contractInfo} />

        <MinDepositAmounts />
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

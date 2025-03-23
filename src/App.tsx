import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { formatUnits } from 'viem/utils';
import { useAccount, WagmiProvider, useDisconnect } from 'wagmi';
import { ChainSwitcher } from './components/ChainSwitcher';
import { ContractInfo } from './components/ContractInfo';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import { MinDepositAmounts } from './components/MinDepositAmounts';
import { TokenLogo } from './components/TokenLogo';
import { SOCIAL_LINKS } from './config/site';
import { config } from './config/wagmi';
import { useContractInfo } from './hooks/useContractInfo';
import { isOKXWallet } from './config/web';

const queryClient = new QueryClient();

function AppContent() {
  const { address } = useAccount();
  const contractInfo = useContractInfo();
  const { disconnect } = useDisconnect();

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

                if (!isOKX) {
                  return (
                    <>
                      <div className='w-full px-4 py-[10px] bg-[#EB8D271A] rounded-md text-warning-weak-light font-medium flex items-center gap-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='25'
                          viewBox='0 0 24 25'
                          fill='none'
                        >
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5ZM11 7.50004V9.50004H13V7.50004H11ZM11 11.5V17.5H13V11.5H11ZM4 12.5C4 16.91 7.59 20.5 12 20.5C16.41 20.5 20 16.91 20 12.5C20 8.09004 16.41 4.50004 12 4.50004C7.59 4.50004 4 8.09004 4 12.5Z'
                            fill='#EB8D27'
                          />
                        </svg>
                        <div>
                          <div className='text-sm'>
                            Use OKX wallet to participate and learn more about the sale.
                          </div>
                          <a
                            href='https://www.okx.com/web3'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:underline font-bold'
                          >
                            Get OKX Wallet
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => disconnect()}
                        className='w-full min-h-10 btn-bordered text-base font-semibold'
                      >
                        Disconnect Wallet
                      </button>
                    </>
                  );
                }

                return null;
              })();
            }}
          </ConnectButton.Custom>

          <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
            <div className='opacity-50'>Total Offering</div>
            <div className='flex gap-1 gap-[10px] items-center'>
              <TokenLogo />
              <div className='text-3xl font-semibold'>
                {!isOKX
                  ? '???'
                  : contractInfo.totalTokensOffered
                    ? formatUnits(
                        contractInfo.totalTokensOffered,
                        contractInfo.offeringTokenDecimals ?? 18
                      )
                    : '-'}
                &nbsp;
                {contractInfo.offeringTokenSymbol ?? ''}
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

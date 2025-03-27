import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { ChainSwitcher } from './components/ChainSwitcher';
import { ConnectOKXButton } from './components/ConnectButton';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import { TokenLogo } from './components/TokenLogo';
import { CHAIN_ID, IDO_CONTRACT_ADDRESS } from './config/contracts';
import { formatTokenAmount } from './config/number';
import { SOCIAL_LINKS } from './config/site';
import { config } from './config/wagmi';
import { isOKXWallet } from './config/web3';
import { DepositForm } from './DepositForm';
import { useContractInfo } from './hooks/useContractInfo';

const queryClient = new QueryClient();

function AppContent() {
  const contractInfo = useContractInfo();

  const [isDepositing, setIsDepositing] = useState(false);

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
        <div
          className={`max-w-[560px] 2xl:max-w-[720px] mx-auto bg-white dark:bg-background-dark rounded-xl p-5 flex flex-col gap-7 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] dark:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] ${isDepositing ? '' : 'min-h-[776px]'}`}
        >
          {isDepositing ? (
            <DepositForm contractInfo={contractInfo} setIsDepositing={setIsDepositing} />
          ) : (
            <>
              <div className='w-full min-h-[120px] rounded-lg bg-[--primary] opacity-20 p-5 flex flex-col items-start gap-7'>
                {CHAIN_ID}-{IDO_CONTRACT_ADDRESS}
              </div>

              <ChainSwitcher />

              {contractInfo.endTimestamp && (
                <Countdown endTime={new Date(Number(contractInfo.endTimestamp) * 1000)} />
              )}

              {contractInfo.status === 'not_started' && <ConnectOKXButton isOKX={isOKX} />}

              {contractInfo.status === 'in_progress' && (
                <div className='flex flex-col gap-5 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
                  <div className='opacity-50'>
                    Deposit {contractInfo.lpToken0?.symbol ?? '-'} to Participate
                  </div>
                  <ConnectOKXButton isOKX={isOKX} />
                  <div className='flex flex-col gap-[10px] items-stretch'>
                    <div className='text-sm font-medium opacity-50'>Deposited</div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-[10px]'>
                        <TokenLogo address={contractInfo.lpToken0?.address} />
                        <div className='text-2xl font-semibold'>
                          {formatTokenAmount(
                            contractInfo.userInfo?.amountPool,
                            contractInfo.lpToken0?.decimals
                          )}
                          &nbsp;{contractInfo.lpToken0?.symbol ?? ''}
                        </div>
                      </div>

                      <button
                        onClick={() => setIsDepositing(true)}
                        className='min-h-12 min-w-[160px] btn-primary text-base font-semibold px-12'
                        disabled={!isOKX}
                      >
                        Deposit
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-[10px] items-stretch'>
                    <div className='text-sm font-medium opacity-50'>Receiving</div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-[10px]'>
                        <TokenLogo address={contractInfo.offeringToken?.address} />
                        <div className='text-2xl font-semibold'>
                          {formatTokenAmount(
                            contractInfo.userInfo?.userOfferingAmountPool,
                            contractInfo.offeringToken?.decimals
                          )}
                          &nbsp;{contractInfo.offeringToken?.symbol ?? ''}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          //
                        }}
                        className='min-h-12 min-w-[160px] btn-bordered text-base font-semibold px-12'
                        disabled
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 items-stretch'>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm font-medium opacity-50'>Total Offering</div>
                      <div className='text-base font-medium'>
                        {formatTokenAmount(
                          contractInfo.totalTokensOffered,
                          contractInfo.offeringToken?.decimals
                        )}
                        &nbsp;{contractInfo.offeringToken?.symbol ?? ''}
                      </div>
                    </div>
                    <div className='flex items-start justify-between'>
                      <div className='text-sm font-medium opacity-50'>Price per Token</div>
                      <div className='flex flex-col items-end gap-[2px]'>
                        <div className='text-base font-medium'>
                          {formatTokenAmount(
                            contractInfo.poolInfo0?.offeringAmountPool
                              ? contractInfo.poolInfo0?.raisingAmountPool?.div(
                                  contractInfo.poolInfo0?.offeringAmountPool
                                )
                              : undefined,
                            contractInfo.lpToken0?.decimals
                          )}
                          &nbsp;{contractInfo.lpToken0?.symbol ?? ''}
                        </div>
                        <div className='text-xs font-medium opacity-50'>
                          ~$
                          {formatTokenAmount(
                            contractInfo.poolInfo0?.offeringAmountPool && contractInfo.lpToken0USD
                              ? contractInfo.poolInfo0?.raisingAmountPool
                                  ?.div(contractInfo.poolInfo0?.offeringAmountPool)
                                  .multipliedBy(contractInfo.lpToken0USD)
                              : undefined,
                            contractInfo.lpToken0?.decimals
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start justify-between'>
                      <div className='text-sm font-medium opacity-50'>Total Raising</div>
                      <div className='flex flex-col items-end gap-[2px]'>
                        <div className='text-base font-medium'>
                          {formatTokenAmount(
                            contractInfo.poolInfo0?.raisingAmountPool,
                            contractInfo.lpToken0?.decimals
                          )}
                          &nbsp;{contractInfo.lpToken0?.symbol ?? ''}
                        </div>
                        <div className='text-xs font-medium opacity-50'>
                          ~$
                          {formatTokenAmount(
                            contractInfo.lpToken0USD
                              ? contractInfo.poolInfo0?.raisingAmountPool?.multipliedBy(
                                  contractInfo.lpToken0USD
                                )
                              : undefined,
                            contractInfo.lpToken0?.decimals
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start justify-between'>
                      <div className='text-sm font-medium opacity-50'>Total Raised</div>
                      <div className='flex flex-col items-end gap-[2px]'>
                        <div className='text-base font-medium'>
                          {formatTokenAmount(
                            contractInfo.poolInfo0?.totalAmountPool,
                            contractInfo.lpToken0?.decimals
                          )}
                          &nbsp;{contractInfo.lpToken0?.symbol ?? ''}
                        </div>
                        <div className='text-xs font-medium opacity-50'>
                          ~$
                          {formatTokenAmount(
                            contractInfo.lpToken0USD
                              ? contractInfo.poolInfo0?.totalAmountPool?.multipliedBy(
                                  contractInfo.lpToken0USD
                                )
                              : undefined,
                            contractInfo.lpToken0?.decimals
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {contractInfo.poolInfo0?.raisingAmountPool &&
                    contractInfo.poolInfo0?.totalAmountPool &&
                    contractInfo.poolInfo0.totalAmountPool.gt(
                      contractInfo.poolInfo0.raisingAmountPool
                    ) && (
                      <div className='flex flex-col gap-[10px] items-center p-4 rounded-lg bg-[#27EBAD1A] dark:bg-gray-800'>
                        <div className='text-[40px] leading-[48px] font-medium'>🎉</div>
                        <div className='flex items-center justify-center gap-[2px] text-sm font-medium'>
                          {contractInfo.poolInfo0.totalAmountPool
                            .div(contractInfo.poolInfo0.raisingAmountPool)
                            .multipliedBy(100)
                            .toFixed(0)}
                          % Oversubscribed{' '}
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='17'
                            viewBox='0 0 16 17'
                            fill='none'
                          >
                            <path
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M8.00065 1.8335C4.32065 1.8335 1.33398 4.82016 1.33398 8.50016C1.33398 12.1802 4.32065 15.1668 8.00065 15.1668C11.6807 15.1668 14.6673 12.1802 14.6673 8.50016C14.6673 4.82016 11.6807 1.8335 8.00065 1.8335ZM8.66748 5.16688H7.33415V6.50021H8.66748V5.16688ZM8.66748 7.83355H7.33415V11.8335H8.66748V7.83355ZM2.66797 8.5002C2.66797 11.4402 5.0613 13.8335 8.0013 13.8335C10.9413 13.8335 13.3346 11.4402 13.3346 8.5002C13.3346 5.5602 10.9413 3.16687 8.0013 3.16687C5.0613 3.16687 2.66797 5.5602 2.66797 8.5002Z'
                              fill='black'
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {contractInfo.status === 'ended' && (
                <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
                  <div className='opacity-50'>Total Offering</div>
                  <div className='flex gap-1 gap-[10px] items-center'>
                    <TokenLogo address={contractInfo.offeringToken?.address} />
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-4 items-stretch p-5 rounded-lg border border-[#0000001A] dark:border-gray-800'>
                <div className='opacity-50'>Total Offering</div>
                <div className='flex gap-1 gap-[10px] items-center'>
                  <TokenLogo address={contractInfo.offeringToken?.address} />
                  <div className='text-3xl font-semibold'>
                    {!isOKX
                      ? '???'
                      : contractInfo.totalTokensOffered && contractInfo.offeringToken
                        ? formatTokenAmount(
                            contractInfo.totalTokensOffered,
                            contractInfo.offeringToken.decimals,
                            true
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
                    unknown printer took a galley of type and scrambled it to make a type specimen
                    book. It has survived not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more
                    recently with desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider attribute='class' defaultTheme='light'>
            <AppContent />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

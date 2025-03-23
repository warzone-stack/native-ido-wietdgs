import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dex } from './Dex';

export function Ido() {
  return (
    <div className='max-w-[560px] min-h-[776px] mx-auto bg-white dark:bg-background-dark rounded-xl p-6 flex flex-col gap-6'>
      <div className='w-full rounded-xl bg-background-light dark:bg-background-dark p-5 flex flex-col items-start gap-7'>
        {/* Wallet Connect Button */}
        <div className='w-full'>
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              return (
                <div>
                  {(() => {
                    if (!mounted || !account || !chain) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className='w-full btn-primary rounded-lg py-3'
                        >
                          Connect Wallet
                        </button>
                      );
                    }
                    return null;
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Add other IDO content here */}
      </div>

      {/* 添加 Dex 组件 */}
      <Dex />
    </div>
  );
}

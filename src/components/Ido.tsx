import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Ido() {
  return (
    <div className='w-full max-w-[560px] min-h-[776px] mx-auto px-5 sm:px-0 mt-5'>
      <div className='w-full min-h-[776px] rounded-xl bg-background-light dark:bg-background-dark p-5 flex flex-col items-start gap-7'>
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
    </div>
  );
}

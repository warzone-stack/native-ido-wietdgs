import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useDisconnect } from 'wagmi';

export interface ConnectButtonProps {
  isOKX?: boolean;
}

export const ConnectOKXButton = ({ isOKX }: ConnectButtonProps) => {
  const { disconnect } = useDisconnect();

  return (
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
                      fillRule='evenodd'
                      clipRule='evenodd'
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
                      className='underline font-bold hover:text-primary'
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
  );
};

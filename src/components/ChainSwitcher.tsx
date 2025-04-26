import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function ChainSwitcher() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected) {
    return null;
  }

  return (
    <div className='w-full p-4 rounded-lg bg-warning-weak-light dark:bg-warning-weak-dark text-white'>
      <div className='flex flex-col gap-2'>
        <p className='text-sm'>Please connect a Solana wallet to interact with the contract</p>
        <button
          onClick={() => {
            // 链接 solana 钱包
            setVisible(true);
          }}
          className='w-full py-2 px-4 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white hover:opacity-90 transition-opacity'
        >
          Connect Solana Wallet
        </button>
      </div>
    </div>
  );
}

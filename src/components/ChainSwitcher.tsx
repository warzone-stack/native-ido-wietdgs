import { useChainId, useSwitchChain } from 'wagmi';
import { CHAIN_ID } from '../config/contracts';
import { bsc } from 'wagmi/chains';

export function ChainSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (chainId === CHAIN_ID) {
    return null;
  }

  return (
    <div className='w-full p-4 rounded-lg bg-warning-weak-light dark:bg-warning-weak-dark text-white'>
      <div className='flex flex-col gap-2'>
        <p className='text-sm'>Please switch to BSC Mainnet to interact with the contract</p>
        <button
          onClick={() => switchChain({ chainId: bsc.id })}
          className='w-full py-2 px-4 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white hover:opacity-90 transition-opacity'
        >
          Switch to BSC Mainnet
        </button>
      </div>
    </div>
  );
}

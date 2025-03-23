import { useReadContract } from 'wagmi';
import { idoContract } from '../config/contracts';

export function MinDepositAmounts() {
  const {
    data: minDepositAmount0,
    isError: isError0,
    isLoading: isLoading0,
  } = useReadContract({
    ...idoContract,
    functionName: 'MIN_DEPOSIT_AMOUNTS',
    args: [0n],
  });

  const {
    data: minDepositAmount1,
    isError: isError1,
    isLoading: isLoading1,
  } = useReadContract({
    ...idoContract,
    functionName: 'MIN_DEPOSIT_AMOUNTS',
    args: [1n],
  });

  if (isLoading0 || isLoading1) {
    return (
      <div className='w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800'>
        <p className='text-sm'>Loading minimum deposit amounts...</p>
      </div>
    );
  }

  if (isError0 || isError1) {
    return (
      <div className='w-full p-4 rounded-lg bg-warning-strong-light dark:bg-warning-strong-dark text-white'>
        <p className='text-sm'>Failed to load minimum deposit amounts</p>
      </div>
    );
  }

  return (
    <div className='w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-semibold'>Minimum Deposit Amounts:</h3>
        <div className='flex gap-4'>
          <div>
            <span className='font-medium'>Pool 0:</span> {minDepositAmount0?.toString()}
          </div>
          <div>
            <span className='font-medium'>Pool 1:</span> {minDepositAmount1?.toString()}
          </div>
        </div>
      </div>
    </div>
  );
}

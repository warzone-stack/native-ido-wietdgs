import { formatUnits } from 'viem';
import { useContractInfo } from '../hooks/useContractInfo';

export function ContractInfo({
  offeringTokenAddress,
  offeringTokenDecimals,
  offeringTokenSymbol,
  offeringTokenName,
  startTimestamp,
  endTimestamp,
  minDepositAmount,
  totalTokensOffered,
  poolInfo0,
  status,
}: ReturnType<typeof useContractInfo>) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'text-yellow-500';
      case 'in_progress':
        return 'text-green-500';
      case 'ended':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'ended':
        return 'Ended';
      default:
        return 'Unknown';
    }
  };

  // Calculate sale duration in hours
  const saleDuration =
    startTimestamp && endTimestamp ? Number(endTimestamp - startTimestamp) / 3600 : undefined;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Contract Information</h2>
        <span className={`font-semibold ${getStatusColor(status)}`}>{getStatusText(status)}</span>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
          <h3 className='text-sm text-gray-500 dark:text-gray-400'>Total Offering</h3>
          <p className='text-lg font-semibold'>
            {totalTokensOffered
              ? formatUnits(totalTokensOffered, offeringTokenDecimals ?? 18)
              : '0'}{' '}
            STO
          </p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
          <h3 className='text-sm text-gray-500 dark:text-gray-400'>Sale Duration</h3>
          <p className='text-lg font-semibold'>{saleDuration ? `${saleDuration} hours` : 'N/A'}</p>
        </div>
      </div>

      <div className='space-y-2'>
        <p>
          <strong>Addresses:</strong> {offeringTokenAddress}
        </p>
        <p>
          <strong>Start Timestamp:</strong> {startTimestamp?.toString()}
        </p>
        <p>
          <strong>End Timestamp:</strong> {endTimestamp?.toString()}
        </p>
        <p>
          <strong>Min Deposit Amount:</strong>{' '}
          {minDepositAmount ? formatUnits(minDepositAmount, 18) : 'N/A'} ETH
        </p>
        <p>
          <strong>Total Tokens Offered:</strong> {totalTokensOffered?.toString()}
        </p>
      </div>

      {poolInfo0 && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>Pool 0 Information</h3>
          <div className='space-y-1'>
            <p>Raising Amount: {formatUnits(poolInfo0.raisingAmountPool, 18)} ETH</p>
            <p>Offering Amount: {formatUnits(poolInfo0.offeringAmountPool, 18)}</p>
            <p>Cap Per User: {formatUnits(poolInfo0.capPerUserInLP, 18)} ETH</p>
            <p>Has Tax: {poolInfo0.hasTax ? 'Yes' : 'No'}</p>
            <p>Flat Tax Rate: {formatUnits(poolInfo0.flatTaxRate, 18)}</p>
            <p>Total Amount: {formatUnits(poolInfo0.totalAmountPool, 18)} ETH</p>
            <p>Sum Taxes Overflow: {formatUnits(poolInfo0.sumTaxesOverflow, 18)} ETH</p>
          </div>
        </div>
      )}
    </div>
  );
}

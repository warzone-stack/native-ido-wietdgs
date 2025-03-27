import { useEffect, useMemo } from 'react';
import { TokenLogo } from './components/TokenLogo';
import { formatTokenAmount } from './config/number';
import { useContractInfo } from './hooks/useContractInfo';
import { BaseError, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { idoContract } from './config/contracts';

export interface ClaimFormProps {
  contractInfo: ReturnType<typeof useContractInfo>;
}

export const ClaimForm = (props: ClaimFormProps) => {
  const { contractInfo } = props;

  const {
    data: claimHash,
    error,
    writeContract: claim,
    isPending: claimIsPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        contractInfo.refetchUserBalance();
        contractInfo.refetchUserInfo();
        contractInfo.refetchPoolInfo();
      },
    },
  });
  const {
    isLoading: isClaimConfirming,
    isSuccess: isClaimConfirmed,
    isError: isClaimError,
    error: claimError,
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });
  useEffect(() => {
    if (isClaimConfirmed) {
      contractInfo.refetchUserBalance();
      contractInfo.refetchUserInfo();
      contractInfo.refetchPoolInfo();
    }
  }, [contractInfo, isClaimConfirmed]);

  const claimBtn = useMemo(() => {
    if (contractInfo.status !== 'ended') {
      return {
        disabled: true,
        text: 'Claim',
      };
    }

    if (
      !contractInfo.userInfo ||
      !contractInfo.userInfo.userOfferingAmountPool ||
      contractInfo.userInfo.userOfferingAmountPool.lte(0)
    ) {
      return {
        disabled: true,
        text: 'Claim',
      };
    }

    if (claimIsPending) {
      return {
        text: 'Claiming...',
        disabled: true,
      };
    }

    if (isClaimConfirming) {
      return {
        text: 'Confirming...',
        disabled: true,
      };
    }

    return {
      disabled: false,
      text: 'Claim',
      onClick: () => {
        if (!idoContract.address) {
          return;
        }
        claim({
          address: idoContract.address,
          abi: idoContract.abi,
          functionName: 'harvestPool',
          args: [0],
        });
      },
    };
  }, [contractInfo.status, contractInfo.userInfo, claim, claimIsPending, isClaimConfirming]);

  return (
    <div className='flex flex-col gap-[10px] items-stretch'>
      <div className='text-sm font-medium opacity-50'>Receiving</div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[10px]'>
          <TokenLogo token={contractInfo.offeringToken} />
          <div className='text-2xl font-semibold'>
            {formatTokenAmount(
              contractInfo.userInfo?.userOfferingAmountPool,
              contractInfo.offeringToken?.decimals
            )}
            &nbsp;{contractInfo.offeringToken?.symbol ?? ''}
          </div>
        </div>

        <button
          className='min-h-12 min-w-[160px] btn-bordered text-base font-semibold px-12'
          disabled={claimBtn.disabled}
          onClick={claimBtn.onClick}
        >
          {claimBtn.text}
        </button>
      </div>
      {error && (
        <div className='text-red-500 text-xs'>
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
      {claimError && (
        <div className='text-red-500 text-xs'>
          Error: {(claimError as BaseError).shortMessage || claimError.message}
        </div>
      )}
    </div>
  );
};

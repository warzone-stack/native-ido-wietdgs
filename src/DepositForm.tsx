import '@rainbow-me/rainbowkit/styles.css';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { TokenLogo } from './components/TokenLogo';
import { idoContract } from './config/contracts';
import { formatTokenAmount } from './config/number';
import { isNativeToken } from './config/token';
import { useContractInfo } from './hooks/useContractInfo';

export interface DepositFormProps {
  contractInfo: ReturnType<typeof useContractInfo>;
  setIsDepositing: (isDepositing: boolean) => void;
}

export const DepositForm = ({ contractInfo, setIsDepositing }: DepositFormProps) => {
  const { address } = useAccount();

  const [depositAmount, setDepositAmount] = useState<string>('');

  const {
    data: approveHash,
    writeContract: approve,
    isPending: approveIsPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        contractInfo.refetchUserBalance();
      },
    },
  });
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });
  useEffect(() => {
    if (isApproveConfirmed) {
      contractInfo.refetchUserBalance();
    }
  }, [contractInfo, isApproveConfirmed]);

  const {
    data: depositHash,
    writeContract: deposit,
    isPending: depositIsPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        contractInfo.refetchUserBalance();
        contractInfo.refetchUserInfo();
        contractInfo.refetchPoolInfo();
      },
    },
  });
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });
  useEffect(() => {
    if (isDepositConfirmed) {
      contractInfo.refetchUserBalance();
      contractInfo.refetchUserInfo();
      contractInfo.refetchPoolInfo();
      setIsDepositing(false);
    }
  }, [contractInfo, isDepositConfirmed, setIsDepositing]);

  const depositBtn = useMemo(() => {
    if (!address) {
      return {
        text: 'Connect Wallet',
        disabled: true,
      };
    }

    if (
      !contractInfo ||
      !contractInfo.lpToken0 ||
      !contractInfo.lpToken0.address ||
      !contractInfo.lpToken0.decimals
    ) {
      return {
        text: 'Deposit',
        disabled: true,
      };
    }

    const depositAmountBN = new BigNumber(depositAmount);
    if (depositAmountBN.lte(0) || !depositAmountBN.isFinite()) {
      return {
        text: 'Invalid amount',
        disabled: true,
      };
    }

    if (!contractInfo.lpToken0Balance || depositAmountBN.gt(contractInfo.lpToken0Balance)) {
      return {
        text: 'Insufficient balance',
        disabled: true,
      };
    }

    if (approveIsPending) {
      return {
        text: 'Approving...',
        disabled: true,
      };
    }

    if (isApproveConfirming) {
      return {
        text: 'Confirming...',
        disabled: true,
      };
    }

    if (!isNativeToken(contractInfo.lpToken0)) {
      if (!contractInfo.lpToken0Allowance || depositAmountBN.gt(contractInfo.lpToken0Allowance)) {
        return {
          text: `Approve ${contractInfo.lpToken0.symbol}`,
          disabled: false,
          onClick: () => {
            if (!contractInfo.lpToken0?.address) {
              return;
            }

            approve({
              address: contractInfo.lpToken0.address,
              abi: erc20Abi,
              functionName: 'approve',
              args: [
                idoContract.address,
                BigInt(
                  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
                ),
              ],
            });
          },
        };
      }
    }

    if (depositIsPending) {
      return {
        text: 'Depositing...',
        disabled: true,
      };
    }

    if (isDepositConfirming) {
      return {
        text: 'Confirming...',
        disabled: true,
      };
    }

    return {
      text: 'Deposit',
      disabled: false,
      onClick: () => {
        if (!contractInfo.lpToken0 || !idoContract.address) {
          return;
        }

        const isNative = isNativeToken(contractInfo.lpToken0);
        const depositAmountValue = BigInt(
          depositAmountBN
            .multipliedBy(`1e${contractInfo.lpToken0.decimals}`)
            .dp(0, BigNumber.ROUND_DOWN)
            .toString()
        );
        deposit({
          address: idoContract.address,
          abi: idoContract.abi,
          functionName: 'depositPool',
          args: [isNative ? BigInt(0) : depositAmountValue, 0, 0n, '0x0'],
          value: isNative ? depositAmountValue : undefined,
        });
      },
    };
  }, [
    address,
    contractInfo,
    depositAmount,
    approveIsPending,
    isApproveConfirming,
    depositIsPending,
    isDepositConfirming,
    approve,
    deposit,
  ]);

  return (
    <>
      <button
        className='w-full flex items-center justify-start gap-[10px] text-black hover:text-gray-500'
        onClick={() => setIsDepositing(false)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z'
            fill='currentColor'
          />
        </svg>
        <div className='text-base font-semibold'>
          Deposit {contractInfo.lpToken0?.symbol ?? '-'}
        </div>
      </button>
      <div className='flex flex-col gap-5 items-stretch'>
        <div className='flex flex-col items-stretch gap-[10px] p-5 rounded-lg bg-[#0000001A] dark:bg-gray-800'>
          <div className='flex items-end justify-between'>
            <div className='flex flex-col items-start gap-[10px]'>
              <div className='text-base font-medium opacity-50'>Amount</div>
              <input
                type='number'
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className='text-3xl font-semibold bg-transparent outline-none max-w-[350px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                placeholder='0.00'
                min='0'
                step='any'
              />
            </div>
            <div className='flex flex-col items-end gap-[10px]'>
              <div className='flex items-center gap-2 p-2 rounded-sm bg-[#0000001A] dark:bg-background-dark'>
                <TokenLogo address={contractInfo.lpToken0?.address} size={24} />
                <div className='text-base font-semibold'>{contractInfo.lpToken0?.symbol ?? ''}</div>
              </div>
            </div>
          </div>
          <div className='flex items-end justify-between'>
            <div className='text-xs font-semibold opacity-50'>
              $
              {formatTokenAmount(
                contractInfo.lpToken0USD
                  ? contractInfo.lpToken0USD.multipliedBy(depositAmount || '0')
                  : undefined,
                contractInfo.lpToken0?.decimals
              )}
            </div>
            <div className='flex items-center gap-2 font-medium text-xs'>
              <div className='opacity-50'>
                Balance:&nbsp;
                {formatTokenAmount(contractInfo.lpToken0Balance, contractInfo.lpToken0?.decimals)}
                &nbsp;
                {contractInfo.lpToken0?.symbol ?? ''}
              </div>
              <button
                className='text-xs hover:opacity-50'
                onClick={() => {
                  if (contractInfo.lpToken0Balance) {
                    setDepositAmount(contractInfo.lpToken0Balance.toString());
                  }
                }}
              >
                MAX
              </button>
            </div>
          </div>
        </div>
        <button
          className='w-full min-h-14 btn-primary text-base font-semibold px-12'
          onClick={depositBtn.onClick}
          disabled={depositBtn.disabled}
        >
          {depositBtn.text}
        </button>
      </div>
    </>
  );
};

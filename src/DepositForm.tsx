import { BN } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useContext, useMemo, useState } from 'react';
import { TokenLogo } from './components/TokenLogo';
import { formatTokenAmount } from './config/number';
import { useAlphaVaultInfo } from './hooks/useAlphaVaultInfo';
import { VaultContext } from './solana/VaultContext';

export interface DepositFormProps {
  contractInfo: ReturnType<typeof useAlphaVaultInfo>;
  setIsDepositing: (isDepositing: boolean) => void;
}

export const DepositForm = ({ contractInfo, setIsDepositing }: DepositFormProps) => {
  const { wallet, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();

  const { vault, refetchVault } = useContext(VaultContext);

  const [depositAmount, setDepositAmount] = useState<string>('');

  const {
    mutate: deposit,
    error,
    isPending: depositIsPending,
  } = useMutation({
    mutationFn: async () => {
      if (!vault || !publicKey || !wallet) {
        return;
      }

      const depositBN = new BigNumber(depositAmount);

      const depositAmountBN = new BN(
        depositBN
          .multipliedBy(`1e${contractInfo.lpToken0?.decimals}`)
          .dp(0, BigNumber.ROUND_DOWN)
          .toString()
      );
      const claimTx = await vault.deposit(depositAmountBN, publicKey);

      console.log('Claiming bought token', claimTx);
      const txHash = await wallet.adapter.sendTransaction(claimTx, connection);
      console.log('txHash', txHash);

      const latestBlockhash = await connection.getLatestBlockhash();
      const confirmResult = await connection.confirmTransaction({
        signature: txHash,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });
      console.log('confirmResult', confirmResult);

      return confirmResult;
    },
    onSuccess: () => {
      refetchVault();
    },
    onError: (error) => {
      console.error('Deposit error', error);
      refetchVault();
    },
  });

  const depositBtn = useMemo(() => {
    if (!publicKey) {
      return {
        text: 'Connect Wallet',
        disabled: false,
        onClick: () => setVisible(true),
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

    if (depositIsPending) {
      return {
        text: 'Depositing...',
        disabled: true,
      };
    }

    return {
      text: 'Deposit',
      disabled: false,
      onClick: () => {
        deposit();
      },
    };
  }, [contractInfo, deposit, depositAmount, depositIsPending, publicKey, setVisible]);

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
                className='text-3xl font-semibold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none max-w-[200px] md:max-w-[350px]'
                placeholder='0.00'
                min='0'
                step='any'
              />
            </div>
            <div className='flex flex-col items-end gap-[10px]'>
              <div className='flex items-center gap-2 p-2 rounded-sm bg-[#0000001A] dark:bg-background-dark'>
                <TokenLogo token={contractInfo.lpToken0} size={24} />
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
        {error && <div className='text-red-500 text-xs'>Error: {error.message}</div>}
      </div>
    </>
  );
};

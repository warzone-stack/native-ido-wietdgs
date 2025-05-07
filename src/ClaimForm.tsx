import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { TokenLogo } from './components/TokenLogo';
import { formatTokenAmount } from './config/number';
import { useAlphaVaultInfo } from './hooks/useAlphaVaultInfo';
import { VaultContext } from './solana/VaultContext';

export interface ClaimFormProps {
  contractInfo: ReturnType<typeof useAlphaVaultInfo>;
}

export const ClaimForm = ({ contractInfo }: ClaimFormProps) => {
  const { wallet, publicKey } = useWallet();
  const { connection } = useConnection();

  const { vault, refetchVault } = useContext(VaultContext);

  const {
    mutate: claim,
    error,
    isPending: claimIsPending,
  } = useMutation({
    mutationFn: async () => {
      if (!vault || !publicKey || !wallet) {
        return;
      }

      const claimTx = await vault.claimToken(publicKey);

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
      console.error('Claim error', error);
      refetchVault();
    },
  });

  const {
    mutate: withdraw,
    error: withdrawError,
    isPending: withdrawIsPending,
  } = useMutation({
    mutationFn: async () => {
      if (!vault || !publicKey || !wallet) {
        return;
      }

      const withdrawRemainingTx = await vault.withdrawRemainingQuote(publicKey);

      console.log('Withdrawing remaining quote', withdrawRemainingTx);
      const txHash = await wallet.adapter.sendTransaction(withdrawRemainingTx, connection);
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
      console.error('Withdraw error', error);
      refetchVault();
    },
  });

  const claimBtn = useMemo(() => {
    if (contractInfo.status !== 'ended') {
      return {
        disabled: true,
        text: 'Claim',
      };
    }

    if (contractInfo.claimStartTimestamp > contractInfo.now) {
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

    return {
      disabled: false,
      text: 'Claim',
      onClick: () => {
        claim();
      },
    };
  }, [
    claim,
    claimIsPending,
    contractInfo.claimStartTimestamp,
    contractInfo.now,
    contractInfo.status,
    contractInfo.userInfo,
  ]);

  const withdrawBtn = useMemo(() => {
    if (contractInfo.status !== 'ended') {
      return {
        disabled: true,
        text: 'Withdraw',
      };
    }

    if (contractInfo.claimStartTimestamp > contractInfo.now) {
      return {
        disabled: true,
        text: 'Withdraw',
      };
    }

    if (
      !contractInfo.userInfo ||
      !contractInfo.userInfo.userRefundingAmountPool ||
      contractInfo.userInfo.userRefundingAmountPool.lte(0)
    ) {
      return {
        disabled: true,
        text: 'Withdraw',
      };
    }

    if (withdrawIsPending) {
      return {
        text: 'Withdrawing...',
        disabled: true,
      };
    }

    return {
      disabled: false,
      text: 'Withdraw',
      onClick: () => {
        withdraw();
      },
    };
  }, [
    withdraw,
    withdrawIsPending,
    contractInfo.claimStartTimestamp,
    contractInfo.now,
    contractInfo.status,
    contractInfo.userInfo,
  ]);

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
          className='min-h-12 min-w-[80px] md:min-w-[160px] btn-bordered text-base font-semibold px-2 md:px-12'
          disabled={claimBtn.disabled}
          onClick={claimBtn.onClick}
        >
          {claimBtn.text}
        </button>
      </div>
      {error && <div className='text-red-500 text-xs'>Error: {error.message}</div>}

      <div className='text-sm font-medium opacity-50'>Withdraw unused</div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[10px]'>
          <TokenLogo token={contractInfo.lpToken0} />
          <div className='text-2xl font-semibold'>
            {formatTokenAmount(
              contractInfo.userInfo?.userRefundingAmountPool,
              contractInfo.lpToken0?.decimals
            )}
            &nbsp;{contractInfo.lpToken0?.symbol ?? ''}
          </div>
        </div>

        <button
          className='min-h-12 min-w-[80px] md:min-w-[160px] btn-bordered text-base font-semibold '
          disabled={withdrawBtn.disabled}
          onClick={withdrawBtn.onClick}
        >
          {withdrawBtn.text}
        </button>
      </div>
      {withdrawError && <div className='text-red-500 text-xs'>Error: {withdrawError.message}</div>}
    </div>
  );
};

import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useContext } from 'react';
import { CLUSTER } from '../config/contracts';
import { VaultContext } from '../solana/VaultContext';
import { useTokenInfo } from './useTokenInfo';
import { useCryptoPrice } from './useCryptoPrice';

export type IDOStatus = 'not_started' | 'in_progress' | 'ended';

export function useAlphaVaultInfo() {
  const { vault } = useContext(VaultContext);
  const { wallet, publicKey } = useWallet();

  const { data: escrowInfo } = useQuery({
    queryKey: ['vault', 'getEscrow', vault?.vault.totalEscrow, publicKey],
    queryFn: async () => {
      if (!vault || !publicKey) {
        return null;
      }
      const escrow = await vault.getEscrow(publicKey);
      console.log('escrow claimedToken:', escrow?.claimedToken.toString());
      console.log('escrow totalDeposit:', escrow?.totalDeposit.toString());
      console.log('escrow lastClaimedPoint:', escrow?.lastClaimedPoint.toString());
      console.log('escrow maxCap:', escrow?.maxCap.toString());
      console.log('escrow vault:', escrow?.vault.toString());

      const depositInfo = await vault.getDepositInfo(escrow);
      console.log('depositInfo totalDeposit', depositInfo.totalDeposit.toString());
      console.log('depositInfo totalFilled', depositInfo.totalFilled.toString());
      console.log('depositInfo totalReturned', depositInfo.totalReturned.toString());

      if (!escrow) {
        return null;
      }
      const claimable = depositInfo.totalFilled.sub(escrow.claimedToken);
      console.log('claimable:', claimable.toString());

      return {
        escrow,
        depositInfo,
        claimable,
      };
    },
    enabled: !!vault && !!publicKey,
  });

  // mock 数据
  const { token: lpToken0, balance: lpToken0Balance } = useTokenInfo({
    mint: vault?.vault.quoteMint,
    chainId: CLUSTER,
  });
  const { token: offeringToken, balance: offeringTokenBalance } = useTokenInfo({
    mint: vault?.vault.baseMint,
    chainId: CLUSTER,
  });

  const { data: lpToken0USD, isLoading: lpToken0USDLoading } = useCryptoPrice(lpToken0);
  const { data: offeringTokenUSD, isLoading: offeringTokenUSDLoading } =
    useCryptoPrice(offeringToken);

  const now = Math.floor(Date.now() / 1000);

  let startTimestamp =
    vault && BN.isBN(vault.vault.depositingPoint)
      ? vault.vault.depositingPoint.toNumber()
      : undefined;
  if (startTimestamp === 0) {
    startTimestamp = now;
  }
  const endTimestamp =
    vault && BN.isBN(vault.vault.startVestingPoint)
      ? vault.vault.startVestingPoint.toNumber()
      : undefined;

  // Calculate IDO status based on timestamps
  const status: IDOStatus = (() => {
    if (startTimestamp === undefined || endTimestamp === undefined) {
      return 'not_started';
    }

    const start = startTimestamp;
    const end = endTimestamp;

    if (now < start) return 'not_started';
    if (now > end) return 'ended';
    return 'in_progress';
  })();

  const totalTokensOffered = new BigNumber(10000);
  const poolInfo0 = {
    raisingAmountPool: new BigNumber(5000),
    offeringAmountPool: new BigNumber(10000),
    capPerUserInLP: new BigNumber(10),
    totalAmountPool: vault
      ? new BigNumber(vault.vault.totalDeposit.toString()).div(`1e${lpToken0?.decimals}`)
      : new BigNumber(0),
  };
  const userInfo = {
    amountPool: escrowInfo
      ? new BigNumber(escrowInfo?.depositInfo.totalDeposit.toString()).div(
          `1e${lpToken0?.decimals}`
        )
      : new BigNumber(0),
    userOfferingAmountPool: escrowInfo
      ? new BigNumber(escrowInfo?.claimable.toString()).div(`1e${offeringToken?.decimals}`)
      : new BigNumber(0),
    userRefundingAmountPool: new BigNumber(0),
  };

  return {
    pool: vault?.vault.pool instanceof PublicKey ? vault.vault.pool : undefined,
    lpToken0,
    lpToken0USD,
    lpToken0USDLoading,
    offeringToken,
    offeringTokenUSD,
    offeringTokenUSDLoading,
    startTimestamp,
    endTimestamp,
    totalTokensOffered,
    poolInfo0,
    status,
    userInfo,
    lpToken0Balance,
  };
}

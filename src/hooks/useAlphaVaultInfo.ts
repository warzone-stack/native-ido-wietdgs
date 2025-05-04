import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useContext } from 'react';
import { CLUSTER } from '../config/contracts';
import { VaultContext } from '../solana/VaultContext';
import { useTokenInfo } from './useTokenInfo';

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
  const lpToken0 = useTokenInfo({
    mint: vault?.vault.quoteMint,
    chainId: CLUSTER,
  });
  const lpToken0USD = 150;
  const lpToken0USDLoading = false;
  const offeringToken = useTokenInfo({
    mint: vault?.vault.baseMint,
    chainId: CLUSTER,
  });
  const offeringTokenUSD = 1;
  const offeringTokenUSDLoading = false;
  const startTimestamp =
    vault && BN.isBN(vault.vault.startVestingPoint)
      ? vault.vault.startVestingPoint.toNumber()
      : undefined;
  const endTimestamp =
    vault && BN.isBN(vault.vault.endVestingPoint)
      ? vault.vault.endVestingPoint.toNumber()
      : undefined;

  // Calculate IDO status based on timestamps
  const status: IDOStatus = (() => {
    if (!startTimestamp || !endTimestamp) return 'not_started';

    const now = BigInt(Math.floor(Date.now() / 1000));
    const start = startTimestamp;
    const end = endTimestamp;

    if (now < start) return 'not_started';
    if (now > end) return 'ended';
    return 'in_progress';
  })();

  const minDepositAmount = 0.1;
  const totalTokensOffered = new BigNumber(10000);
  const poolInfo0 = {
    raisingAmountPool: new BigNumber(5000),
    offeringAmountPool: new BigNumber(10000),
    capPerUserInLP: new BigNumber(10),
    hasTax: false,
    flatTaxRate: new BigNumber(0),
    totalAmountPool: vault ? new BigNumber(vault.vault.totalDeposit.toString()) : new BigNumber(0),
    sumTaxesOverflow: new BigNumber(0),
  };
  const userInfo = {
    amountPool: new BigNumber(100),
    claimedPool: false,
    userOfferingAmountPool: escrowInfo
      ? new BigNumber(escrowInfo?.claimable.toString())
      : new BigNumber(0),
    userRefundingAmountPool: new BigNumber(0),
    userTaxAmountPool: new BigNumber(0),
  };
  const lpToken0Balance = 3;
  const lpToken0Allowance = 0;
  const refetchPoolInfo = () => Promise.resolve();
  const refetchUserInfo = () => Promise.resolve();
  const refetchUserBalance = () => Promise.resolve();

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
    minDepositAmount,
    totalTokensOffered,
    poolInfo0,
    status,
    userInfo,
    lpToken0Balance,
    lpToken0Allowance,
    refetchPoolInfo,
    refetchUserInfo,
    refetchUserBalance,
  };
}

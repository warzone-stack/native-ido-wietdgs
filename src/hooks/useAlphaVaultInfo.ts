import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import { CLUSTER } from '../config/contracts';
import { VaultContext } from '../solana/VaultContext';
import { useTokenInfo } from './useTokenInfo';
import { useCryptoPrice } from './useCryptoPrice';
import { ActivationType } from '../alpha-vault/type';

export type IDOStatus = 'not_started' | 'in_progress' | 'ended';

// CONFIG
// https://solscan.io/tx/2RueuEtqn9VbNmpN2UQmW5whPn4PH7A8SBq77CLKjZkMsDqTieLgP2ScofpTZpoMFLaW58iDEkXGX1JphJ4jt6xb?cluster=devnet
const totalTokensOffered = new BigNumber(100);
const activation_point = 1746615900;

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

  // const [now, setNow] = useState(1746593700 + 60);
  const [now, setNow] = useState(() => {
    return Math.floor(Date.now() / 1000);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // const now = Math.floor(Date.now() / 1000);
  // const now = 1746593700 + 60;

  let startTimestamp =
    vault && BN.isBN(vault.vault.depositingPoint)
      ? (vault.vault.depositingPoint.toNumber() as number)
      : undefined;
  if (startTimestamp === 0) {
    startTimestamp = now;
  }

  /**
1. Initialize customizable permissionless constant product pool with
ActivationType = 1 // Timestamp based
ActivationPoint = 1746785100 // 10:05 am May 9
2. Initialize vault
DepositingPoint = 1746774000 // 07:00 am May 9
StartVestingPoint = 1746785101 // 10:05:01 am May 9
endVestingPoint = 1746785101 // 10:05:01 am May 9
With this configuration, the timing will be:
1. Deposit open: 07:00 am
2. Deposit close: 09:00 am
3. 5 minutes time window for user to check their details on UI before fill vault
4. Alpha vault start filling: 09:05 am (fixed 1 hour filling window in case failed to fill, it can retry)
5. Pool start trading: 10:05 am
6. User claim token 1 seconds after pool start trading (currently program have checking where claim must > pool start trade time, 1 seconds doesn’t seems will impact much)
Time window in step 3 and 4 is fixed, cannot be modified through parameter
   */
  // The vault open deposit at depositing_point field, and close deposit at pool.bootstrapping.activation_point - buffer - buffer / 12, where buffer = 9000 when activation_type is slot, buffer = 3600 when activation_type is time
  const buffer = vault?.vault.activationType === ActivationType.SLOT ? 9000 : 3600;
  const endTimestamp = activation_point - buffer - buffer / 12;
  const claimStartTimestamp = activation_point + 1;

  console.log('now:', now);
  console.log('startTimestamp:', startTimestamp);
  console.log('endTimestamp:', endTimestamp);
  console.log('claimStartTimestamp:', claimStartTimestamp);
  //   now: 1746590460
  //  startTimestamp: 1746590400
  //  endTimestamp: 1746593700
  // claimStartTimestamp: 1746597601

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

  const poolInfo0 = {
    raisingAmountPool: vault
      ? new BigNumber(vault.vault.maxBuyingCap.toString()).div(`1e${lpToken0?.decimals}`)
      : new BigNumber(0),
    offeringAmountPool: totalTokensOffered,
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
    now,
    startTimestamp,
    endTimestamp,
    claimStartTimestamp,
    totalTokensOffered,
    poolInfo0,
    status,
    userInfo,
    lpToken0Balance,
  };
}

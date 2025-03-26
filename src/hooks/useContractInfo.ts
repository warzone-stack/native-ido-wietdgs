import { useChainId, useReadContracts } from 'wagmi';
import { idoContract } from '../config/contracts';
import { useTokenInfo } from './useTokenInfo';

export type PoolInfo = {
  raisingAmountPool: bigint;
  offeringAmountPool: bigint;
  capPerUserInLP: bigint;
  hasTax: boolean;
  flatTaxRate: bigint;
  totalAmountPool: bigint;
  sumTaxesOverflow: bigint;
};

export type IDOStatus = 'not_started' | 'in_progress' | 'ended';

export function useContractInfo() {
  const chainId = useChainId();

  const { data } = useReadContracts({
    contracts: [
      {
        ...idoContract,
        functionName: 'addresses',
        // [0] lpToken0
        // [1] lpToken1
        // [2] offeringToken
        // [3] adminAddress
        args: [0n],
      },
      {
        ...idoContract,
        functionName: 'addresses',
        // [0] lpToken0
        // [1] lpToken1
        // [2] offeringToken
        // [3] adminAddress
        args: [2n],
      },
      {
        ...idoContract,
        functionName: 'startTimestamp',
      },
      {
        ...idoContract,
        functionName: 'endTimestamp',
      },
      {
        ...idoContract,
        functionName: 'MIN_DEPOSIT_AMOUNTS',
        // uint256 _0 - pass in the pool id, should always be 0 since we only do one single pool
        args: [0n],
      },
      {
        ...idoContract,
        functionName: 'totalTokensOffered',
      },
      {
        ...idoContract,
        functionName: '_poolInformation',
        args: [0n],
      } as const,
    ],
  });

  const [
    lpToken0AddressResult,
    offeringTokenAddressResult,
    startTimestampResult,
    endTimestampResult,
    minDepositAmountsResult,
    totalTokensOfferedResult,
    poolInfo0Result,
  ] = data || [];

  const lpToken0Address =
    lpToken0AddressResult?.status === 'success' ? lpToken0AddressResult.result : undefined;
  const offeringTokenAddress =
    offeringTokenAddressResult?.status === 'success'
      ? offeringTokenAddressResult.result
      : undefined;
  const startTimestamp =
    startTimestampResult?.status === 'success' ? startTimestampResult.result : undefined;
  const endTimestamp =
    endTimestampResult?.status === 'success' ? endTimestampResult.result : undefined;
  /**
   * uint256 - the minimum commit amount for given pool, should always be 1000000 . Should block user commit/deposit when trying to commit less than this number.
   */
  const minDepositAmount =
    minDepositAmountsResult?.status === 'success'
      ? (minDepositAmountsResult.result as unknown as bigint)
      : undefined;
  const totalTokensOffered =
    totalTokensOfferedResult?.status === 'success' ? totalTokensOfferedResult.result : undefined;

  // Transform pool information results into PoolInfo type
  const poolInfo0 =
    poolInfo0Result?.status === 'success'
      ? {
          raisingAmountPool: poolInfo0Result.result[0] as bigint,
          offeringAmountPool: poolInfo0Result.result[1] as bigint,
          capPerUserInLP: poolInfo0Result.result[2] as bigint,
          hasTax: poolInfo0Result.result[3] as boolean,
          flatTaxRate: poolInfo0Result.result[4] as bigint,
          totalAmountPool: poolInfo0Result.result[5] as bigint,
          sumTaxesOverflow: poolInfo0Result.result[6] as bigint,
        }
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

  const { tokenInfo: offeringToken } = useTokenInfo(offeringTokenAddress, chainId);
  const { tokenInfo: lpToken0 } = useTokenInfo(lpToken0Address, chainId);

  return {
    lpToken0,
    offeringToken,
    startTimestamp,
    endTimestamp,
    minDepositAmount,
    totalTokensOffered,
    poolInfo0,
    status,
  };
}

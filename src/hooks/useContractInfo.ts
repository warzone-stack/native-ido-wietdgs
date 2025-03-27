import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, useChainId, useReadContracts } from 'wagmi';
import { idoContract } from '../config/contracts';
import { isNativeToken } from '../config/token';
import { useCryptoPrice } from './useCryptoPrice';
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
  const { address } = useAccount();

  const { data, refetch: refetchPoolInfo } = useReadContracts({
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

  const { data: userInfoData, refetch: refetchUserInfo } = useReadContracts({
    contracts: [
      {
        ...idoContract,
        functionName: 'viewUserInfo',
        args: address ? [address, [0]] : undefined,
      },
      {
        ...idoContract,
        functionName: 'viewUserOfferingAndRefundingAmountsForPools',
        args: address ? [address, [0]] : undefined,
      },
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

  const { tokenInfo: lpToken0 } = useTokenInfo(lpToken0Address, chainId);
  const { tokenInfo: offeringToken } = useTokenInfo(offeringTokenAddress, chainId);

  const { data: lpToken0USD, isLoading: lpToken0USDLoading } = useCryptoPrice(lpToken0);
  const { data: offeringTokenUSD, isLoading: offeringTokenUSDLoading } =
    useCryptoPrice(offeringToken);

  const nativeBalanceData = useBalance({
    address,
  });

  const { data: userBalanceData, refetch: refetchUserBalance } = useReadContracts({
    contracts:
      !lpToken0 || !address || isNativeToken(lpToken0)
        ? undefined
        : [
            {
              address: lpToken0.address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [address],
            },
            {
              address: lpToken0.address,
              abi: erc20Abi,
              functionName: 'allowance',
              args: idoContract.address ? [address, idoContract.address] : undefined,
            },
          ],
  });

  const [minDepositAmount, totalTokensOffered, poolInfo0] = useMemo(() => {
    const minDepositAmount =
      minDepositAmountsResult?.status === 'success' && lpToken0
        ? new BigNumber(minDepositAmountsResult.result.toString()).div(
            new BigNumber(10).pow(lpToken0?.decimals)
          )
        : undefined;
    const totalTokensOffered =
      totalTokensOfferedResult?.status === 'success' && offeringToken
        ? new BigNumber(totalTokensOfferedResult.result.toString()).div(
            new BigNumber(10).pow(offeringToken?.decimals)
          )
        : undefined;

    // Transform pool information results into PoolInfo type
    const poolInfo0 =
      poolInfo0Result?.status === 'success'
        ? {
            raisingAmountPool: lpToken0
              ? new BigNumber(poolInfo0Result.result[0].toString()).div(
                  new BigNumber(10).pow(lpToken0?.decimals)
                )
              : undefined,
            offeringAmountPool: offeringToken
              ? new BigNumber(poolInfo0Result.result[1].toString()).div(
                  new BigNumber(10).pow(offeringToken?.decimals)
                )
              : undefined,
            capPerUserInLP: lpToken0
              ? new BigNumber(poolInfo0Result.result[2].toString()).div(
                  new BigNumber(10).pow(lpToken0?.decimals)
                )
              : undefined,
            hasTax: poolInfo0Result.result[3] as boolean,
            flatTaxRate: new BigNumber(poolInfo0Result.result[4].toString()),
            totalAmountPool: lpToken0
              ? new BigNumber(poolInfo0Result.result[5].toString()).div(
                  new BigNumber(10).pow(lpToken0?.decimals)
                )
              : undefined,
            sumTaxesOverflow: new BigNumber(poolInfo0Result.result[6].toString()),
          }
        : undefined;

    return [minDepositAmount, totalTokensOffered, poolInfo0];
  }, [
    lpToken0,
    minDepositAmountsResult?.result,
    minDepositAmountsResult?.status,
    offeringToken,
    poolInfo0Result?.result,
    poolInfo0Result?.status,
    totalTokensOfferedResult?.result,
    totalTokensOfferedResult?.status,
  ]);

  const userInfo = useMemo(() => {
    if (!userInfoData) {
      return null;
    }
    const [userInfoResult, userOfferingAndRefundingAmountsResult] = userInfoData;
    if (
      userInfoResult.status !== 'success' ||
      userOfferingAndRefundingAmountsResult.status !== 'success'
    ) {
      return null;
    }
    const [userInfo, userOfferingAndRefundingAmounts] = [
      userInfoResult.result,
      userOfferingAndRefundingAmountsResult.result,
    ];

    const amountPool = userInfo[0][0];
    const claimedPool = userInfo[1][0];

    const userOfferingAmountPool = userOfferingAndRefundingAmounts[0][0];
    const userRefundingAmountPool = userOfferingAndRefundingAmounts[0][1];
    const userTaxAmountPool = userOfferingAndRefundingAmounts[0][2];

    return {
      amountPool: lpToken0
        ? new BigNumber(amountPool.toString()).div(new BigNumber(10).pow(lpToken0?.decimals))
        : undefined,
      claimedPool,
      userOfferingAmountPool: offeringToken
        ? new BigNumber(userOfferingAmountPool.toString()).div(
            new BigNumber(10).pow(offeringToken?.decimals)
          )
        : undefined,
      userRefundingAmountPool: lpToken0
        ? new BigNumber(userRefundingAmountPool.toString()).div(
            new BigNumber(10).pow(lpToken0?.decimals)
          )
        : undefined,
      userTaxAmountPool: lpToken0
        ? new BigNumber(userTaxAmountPool.toString()).div(new BigNumber(10).pow(lpToken0?.decimals))
        : undefined,
    };
  }, [lpToken0, offeringToken, userInfoData]);

  const { balance: lpToken0Balance, allowance: lpToken0Allowance } = useMemo(() => {
    if (!lpToken0) {
      return { balance: undefined, allowance: undefined };
    }
    if (isNativeToken(lpToken0)) {
      return {
        balance: nativeBalanceData.data
          ? new BigNumber(nativeBalanceData.data.value.toString()).div(
              new BigNumber(10).pow(lpToken0.decimals)
            )
          : undefined,
        allowance: undefined,
      };
    }
    if (!userBalanceData) {
      return { balance: undefined, allowance: undefined };
    }
    const [userBalanceResult, userAllowanceResult] = userBalanceData;
    if (userBalanceResult.status !== 'success' || userAllowanceResult.status !== 'success') {
      return { balance: undefined, allowance: undefined };
    }
    const [userBalance, userAllowance] = [userBalanceResult.result, userAllowanceResult.result];
    return {
      balance: new BigNumber(userBalance.toString()).div(new BigNumber(10).pow(lpToken0.decimals)),
      allowance: new BigNumber(userAllowance.toString()).div(
        new BigNumber(10).pow(lpToken0.decimals)
      ),
    };
  }, [nativeBalanceData, userBalanceData, lpToken0]);

  return {
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

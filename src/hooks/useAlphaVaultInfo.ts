import BigNumber from 'bignumber.js';
import { useContext, useEffect } from 'react';
import { VaultContext } from '../solana/VaultContext';

export function useAlphaVaultInfo() {
  const { vault } = useContext(VaultContext);

  useEffect(() => {
    if (vault) {
      console.log(vault);
    }
  }, [vault]);

  // mock 数据
  const lpToken0 = {
    chainId: 1,
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    symbol: 'SOL',
    name: 'Solana',
  };
  const lpToken0USD = 150;
  const lpToken0USDLoading = false;
  const offeringToken = {
    chainId: 1,
    address: 'USDC111111111111111111111111111111111111111',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  };
  const offeringTokenUSD = 1;
  const offeringTokenUSDLoading = false;
  const startTimestamp = 1718000000n;
  const endTimestamp = 1719000000n;
  const minDepositAmount = 0.1;
  const totalTokensOffered = new BigNumber(10000);
  const poolInfo0 = {
    raisingAmountPool: new BigNumber(5000),
    offeringAmountPool: new BigNumber(10000),
    capPerUserInLP: new BigNumber(10),
    hasTax: false,
    flatTaxRate: new BigNumber(0),
    totalAmountPool: new BigNumber(2000),
    sumTaxesOverflow: new BigNumber(0),
  };
  const status = 'in_progress';
  const userInfo = {
    amountPool: new BigNumber(100),
    claimedPool: false,
    userOfferingAmountPool: new BigNumber(2),
    userRefundingAmountPool: new BigNumber(0),
    userTaxAmountPool: new BigNumber(0),
  };
  const lpToken0Balance = 3;
  const lpToken0Allowance = 0;
  const refetchPoolInfo = () => Promise.resolve();
  const refetchUserInfo = () => Promise.resolve();
  const refetchUserBalance = () => Promise.resolve();

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

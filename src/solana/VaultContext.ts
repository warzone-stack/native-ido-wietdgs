import { BN } from '@coral-xyz/anchor';
import BigNumber from 'bignumber.js';
import { createContext } from 'react';
import { AlphaVault } from '../alpha-vault';

export type VaultContextType = {
  vault: AlphaVault | undefined;
  refetchVault: () => void;
  nativeDepositCap: BN | undefined;
  depositCap: BigNumber | undefined;
  depositorProof: number[][] | undefined;
};

export const VaultContext = createContext<VaultContextType>({
  vault: undefined,
  refetchVault: () => {},
  nativeDepositCap: BN,
  depositCap: undefined,
  depositorProof: undefined,
});

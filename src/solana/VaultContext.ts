import { createContext } from 'react';
import { AlphaVault } from '../alpha-vault';

export type VaultContextType = {
  vault: AlphaVault | undefined;
  refetchVault: () => void;
};

export const VaultContext = createContext<VaultContextType>({
  vault: undefined,
  refetchVault: () => {},
});

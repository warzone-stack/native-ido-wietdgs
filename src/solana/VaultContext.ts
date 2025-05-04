import { createContext } from 'react';
import { AlphaVault } from '../alpha-vault';

export type VaultContextType = {
  vault: AlphaVault | null;
};

export const VaultContext = createContext<VaultContextType>({
  vault: null,
});

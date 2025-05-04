import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { AlphaVault } from '../alpha-vault';
import { VAULT_ADDRESS } from '../config/contracts';
import { VaultContext, VaultContextType } from './VaultContext';

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();

  const [vault, setVault] = useState<VaultContextType['vault']>(null);

  useEffect(() => {
    const initVault = async () => {
      const alphaVault = await AlphaVault.create(connection, VAULT_ADDRESS);
      setVault(alphaVault);
    };
    initVault();
  }, [connection]);

  return <VaultContext.Provider value={{ vault }}>{children}</VaultContext.Provider>;
};

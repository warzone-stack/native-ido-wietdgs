import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { bsc, mainnet, sepolia } from '@wagmi/core/chains';
import { fallback, unstable_connector } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
import { okxWallet } from '@rainbow-me/rainbowkit/wallets';

/**
 * https://www.rainbowkit.com/guides/rainbowkit-wagmi-v2
 */
/* New API that includes Wagmi's createConfig and replaces getDefaultWallets and connectorsForWallets */
export const config = getDefaultConfig({
  appName: 'DEX App',
  //   // Get one from https://cloud.walletconnect.com
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, bsc],
  // connectors: [injected()],
  transports: {
    [bsc.id]: fallback([unstable_connector(injected), http('https://bsc-dataseed.binance.org')]),
    [sepolia.id]: fallback([
      unstable_connector(injected),
      http('https://sepolia.infura.io/v3/7358883bfd5b44dd9d03c50d373e8b6f'),
    ]),
  },
  multiInjectedProviderDiscovery: !import.meta.env.PROD,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [okxWallet],
    },
  ],
});

export enum ChainId {
  ETHEREUM = mainnet.id,
  SEPOLIA = sepolia.id,
  BSC = bsc.id,
}

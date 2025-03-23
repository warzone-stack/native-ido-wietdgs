import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DEX App',
  // Get one from https://cloud.walletconnect.com
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [bsc],
  ssr: false,
});

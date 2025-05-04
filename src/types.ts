import { Cluster } from '@solana/web3.js';

export type TokenInfo = {
  chainId: Cluster;
  address: string;
  decimals: number;
  name: string | undefined;
  symbol: string | undefined;
  image: string | undefined;
};

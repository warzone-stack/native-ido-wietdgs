import { Address } from 'viem';
import { ChainId } from './config/wagmi';

export type TokenInfo = {
  chainId: ChainId;
  address: Address;
  decimals: number;
  name: string | undefined;
  symbol: string | undefined;
};

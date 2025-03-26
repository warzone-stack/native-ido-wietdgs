import { Address } from 'viem';

export type TokenInfo = {
  address: Address;
  decimals: number;
  name: string | undefined;
  symbol: string | undefined;
};

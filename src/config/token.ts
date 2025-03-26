import { isAddressEqual, zeroAddress } from 'viem';
import { bsc, sepolia } from 'viem/chains';
import { TokenInfo } from '../types';
import { ChainId } from './wagmi';

export const NATIVE_TOKEN_MAP: Record<ChainId, TokenInfo> = {
  [ChainId.SEPOLIA]: {
    address: zeroAddress,
    decimals: sepolia.nativeCurrency.decimals,
    name: sepolia.nativeCurrency.name,
    symbol: sepolia.nativeCurrency.symbol,
  },
  [ChainId.BSC]: {
    address: zeroAddress,
    decimals: bsc.nativeCurrency.decimals,
    name: bsc.nativeCurrency.name,
    symbol: bsc.nativeCurrency.symbol,
  },
};

export function isNativeToken(token: TokenInfo) {
  return isAddressEqual(token.address, zeroAddress);
}

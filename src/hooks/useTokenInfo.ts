import { useMemo } from 'react';
import { erc20Abi, isAddressEqual, zeroAddress } from 'viem';
import { useReadContracts } from 'wagmi';
import { NATIVE_TOKEN_MAP } from '../config/token';
import { ChainId } from '../config/wagmi';
import { TokenInfo } from '../types';

export function useTokenInfo(address: `0x${string}` | undefined, chainId: ChainId) {
  const result = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'name',
      },
    ],
    query: {
      enabled: !!address && !isAddressEqual(address, zeroAddress),
    },
  });

  const tokenInfo: TokenInfo | undefined = useMemo(() => {
    if (!address) {
      return undefined;
    }
    if (isAddressEqual(address, zeroAddress)) {
      return NATIVE_TOKEN_MAP[chainId];
    }

    if (!result.data) {
      return {
        chainId,
        address,
        decimals: 18,
        name: '-',
        symbol: '-',
      };
    }

    return {
      chainId,
      address,
      decimals: result.data[0],
      symbol: result.data[1],
      name: result.data[2],
    };
  }, [address, chainId, result.data]);

  return {
    tokenInfo,
    isLoading: result.isLoading,
  };
}

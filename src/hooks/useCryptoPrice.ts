import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { isNativeToken } from '../config/token';
import { ChainId } from '../config/wagmi';
import { TokenInfo } from '../types';

/**
 * https://docs.coingecko.com/v3.0.1/reference/asset-platforms-list
 */
export const ASSET_PLATFORMS = {
  [ChainId.ETHEREUM]: {
    id: 'ethereum',
    chain_identifier: 1,
    name: 'Ethereum',
    shortname: 'Ethereum',
    native_coin_id: 'ethereum',
    image: {
      thumb:
        'https://coin-images.coingecko.com/asset_platforms/images/279/thumb/ethereum.png?1706606803',
      small:
        'https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png?1706606803',
      large:
        'https://coin-images.coingecko.com/asset_platforms/images/279/large/ethereum.png?1706606803',
    },
  },
  [ChainId.SEPOLIA]: {
    id: 'ethereum',
    chain_identifier: 1,
    name: 'Ethereum',
    shortname: 'Ethereum',
    native_coin_id: 'ethereum',
    image: {
      thumb:
        'https://coin-images.coingecko.com/asset_platforms/images/279/thumb/ethereum.png?1706606803',
      small:
        'https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png?1706606803',
      large:
        'https://coin-images.coingecko.com/asset_platforms/images/279/large/ethereum.png?1706606803',
    },
  },
  [ChainId.BSC]: {
    id: 'binance-smart-chain',
    chain_identifier: 56,
    name: 'BNB Smart Chain',
    shortname: 'BSC',
    native_coin_id: 'binancecoin',
    image: {
      thumb:
        'https://coin-images.coingecko.com/asset_platforms/images/1/thumb/bnb_smart_chain.png?1706606721',
      small:
        'https://coin-images.coingecko.com/asset_platforms/images/1/small/bnb_smart_chain.png?1706606721',
      large:
        'https://coin-images.coingecko.com/asset_platforms/images/1/large/bnb_smart_chain.png?1706606721',
    },
  },
} as const;

export function useCryptoPrice(token: TokenInfo | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ['crypto-price', token?.chainId, token?.address],
    enabled: !!token?.chainId && !!token?.address,
    queryFn: async () => {
      if (!token) {
        return undefined;
      }

      if (token.chainId === ChainId.SEPOLIA) {
        return isNativeToken(token) ? new BigNumber(2000) : new BigNumber(100);
      }

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY,
        },
      };

      const id = isNativeToken(token)
        ? ASSET_PLATFORMS[token.chainId].native_coin_id
        : token.address;

      const commonUrl = `https://api.coingecko.com/api/v3/simple/token_price/${ASSET_PLATFORMS[token.chainId].id}?contract_addresses=${id}&vs_currencies=usd`;

      const ethereumUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

      const res = await fetch(isNativeToken(token) ? ethereumUrl : commonUrl, options);
      const json = await res.json();

      if (json[id]?.usd) {
        return new BigNumber(json[id].usd as number);
      }
      return undefined;
    },
  });

  return {
    data,
    isLoading,
  };
}

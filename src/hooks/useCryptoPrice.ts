import { Cluster, PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../types';

/**
 * https://docs.coingecko.com/v3.0.1/reference/asset-platforms-list
 */
export const ASSET_PLATFORMS: Record<Cluster, any> = {
  'mainnet-beta': {
    id: 'solana',
    chain_identifier: null,
    name: 'Solana',
    shortname: 'Solana',
    native_coin_id: 'solana',
    image: {
      thumb:
        'https://coin-images.coingecko.com/asset_platforms/images/5/thumb/solana.png?1706606708',
      small:
        'https://coin-images.coingecko.com/asset_platforms/images/5/small/solana.png?1706606708',
      large:
        'https://coin-images.coingecko.com/asset_platforms/images/5/large/solana.png?1706606708',
    },
  },
  devnet: {
    id: 'solana',
    chain_identifier: null,
    name: 'Solana',
    shortname: 'Solana',
    native_coin_id: 'solana',
  },
  testnet: {
    id: 'solana',
    chain_identifier: null,
    name: 'Solana',
    shortname: 'Solana',
    native_coin_id: 'solana',
  },
};

export function useCryptoPrice(token: TokenInfo | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ['crypto-price', token?.chainId, token?.address],
    enabled: !!token?.chainId && !!token?.address,
    queryFn: async () => {
      if (!token) {
        return null;
      }

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY,
        },
      };

      const isNativeToken = NATIVE_MINT.equals(new PublicKey(token.address));

      const id = isNativeToken
        ? ASSET_PLATFORMS[token.chainId].native_coin_id
        : token.address.toLowerCase();

      const commonUrl = `https://api.coingecko.com/api/v3/simple/token_price/${ASSET_PLATFORMS[token.chainId].id}?contract_addresses=${id}&vs_currencies=usd`;

      const ethereumUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

      const res = await fetch(isNativeToken ? ethereumUrl : commonUrl, options);
      const json = await res.json();

      if (json[id]?.usd) {
        return new BigNumber(json[id].usd as number);
      }

      if (token.chainId === 'devnet') {
        return new BigNumber(1);
      }

      return null;
    },
  });

  return {
    data,
    isLoading,
  };
}

import { Cluster, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useSolanaConnection } from './useSolanaConnection';
import { useEffect } from 'react';

export function useTokenInfo({
  mint,
  chainId,
  symbol,
}: {
  mint: string | PublicKey | undefined;
  chainId: Cluster;
  symbol?: string;
}) {
  const { fetchTokenInfo } = useSolanaConnection();

  const tokenInfoQuery = useQuery({
    queryKey: ['token', 'info', chainId, mint],
    queryFn: async () => {
      const result = await fetchTokenInfo({
        mint,
        chainId,
        symbol,
      });
      return result;
    },
    enabled: !!mint,
  });

  useEffect(() => {
    if (tokenInfoQuery.error) {
      console.log('tokenInfoQuery.error', tokenInfoQuery.error);
    }
  }, [tokenInfoQuery]);

  return tokenInfoQuery.data;
}

import { Cluster, PublicKey } from '@solana/web3.js';

export const VAULT_ADDRESS = new PublicKey(
  import.meta.env.PROD
    ? (import.meta.env.VITE_SOL_VAULT_ADDRESS as string)
    : '8PCjMuYBpWdjadterCxZmiSYg419GJFJEgHbtwZE81p2'
);

export const CLUSTER: Cluster = import.meta.env.PROD
  ? (import.meta.env.VITE_SOL_CLUSTER as Cluster)
  : 'devnet';

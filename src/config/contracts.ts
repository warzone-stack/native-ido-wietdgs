import { NATIVE_MINT } from '@solana/spl-token';
import { Cluster, PublicKey } from '@solana/web3.js';

export const VAULT_ADDRESS = new PublicKey(import.meta.env.VITE_SOL_VAULT_ADDRESS as string);

export const CLUSTER: Cluster = import.meta.env.VITE_SOL_CLUSTER as Cluster;

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const SOL_MINT_ADDRESS = PublicKey.default.toBase58();
export const WSOL_MINT_ADDRESS = NATIVE_MINT.toBase58();

// https://solscan.io/tx/2RueuEtqn9VbNmpN2UQmW5whPn4PH7A8SBq77CLKjZkMsDqTieLgP2ScofpTZpoMFLaW58iDEkXGX1JphJ4jt6xb?cluster=devnet
export const TOTAL_OFFERED = Number(import.meta.env.VITE_SOL_TOTAL_OFFERED) as number;

export const ACTIVATION_POINT = Number(import.meta.env.VITE_SOL_ACTIVATION_POINT) as number;

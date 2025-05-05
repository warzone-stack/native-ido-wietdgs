import { NATIVE_MINT } from '@solana/spl-token';
import { Cluster, PublicKey } from '@solana/web3.js';

export const VAULT_ADDRESS = new PublicKey(
  import.meta.env.PROD
    ? (import.meta.env.VITE_SOL_VAULT_ADDRESS as string)
    : 'HULWmq435HcurzM59tfC4p9txUF71gZH6ghFVSsmWGQY'
);

export const CLUSTER: Cluster = import.meta.env.PROD
  ? (import.meta.env.VITE_SOL_CLUSTER as Cluster)
  : 'devnet';

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const SOL_MINT_ADDRESS = PublicKey.default.toBase58();
export const WSOL_MINT_ADDRESS = NATIVE_MINT.toBase58();

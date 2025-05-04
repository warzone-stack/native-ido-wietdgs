import { PublicKey } from '@solana/web3.js';
import { CLUSTER } from './config/contracts';

export function shortenAddress(address: string | PublicKey | undefined | null) {
  if (!address) {
    return '-';
  }
  const addressString = typeof address === 'string' ? address : address.toBase58();
  return addressString.slice(0, 6) + '...' + addressString.slice(-4);
}

export function generateSolScanLink(
  address: string | PublicKey | undefined | null,
  prefix = 'account'
) {
  if (!address) {
    return '#';
  }
  const addressString = typeof address === 'string' ? address : address.toBase58();
  if (CLUSTER === 'mainnet-beta') {
    return `https://solscan.io/${prefix}/${addressString}`;
  }
  return `https://solscan.io/${prefix}/${addressString}?cluster=${CLUSTER}`;
}

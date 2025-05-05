import { PublicKey } from '@solana/web3.js';
import { SOL_MINT_ADDRESS, WSOL_MINT_ADDRESS } from './contracts';

export function getTokenImage(mint: PublicKey | string | undefined | null) {
  if (!mint) {
    return '/unknown-token-image.png';
  }

  const mintStr = mint.toString();
  switch (mintStr) {
    case SOL_MINT_ADDRESS:
      return 'https://solscan.io/_next/static/media/FallbackCoin.f6322771.png';
    case WSOL_MINT_ADDRESS:
      return 'https://solscan.io/_next/static/media/FallbackCoin.f6322771.png';
    case 'aiy9XpdqsABsLnBvvDwefTLfcZjokNFqLDeD3gGhCRc':
    case 'AuizZEeRvkjAEbpmuyhEd2STGiBHAZqRiMYF8bzt83iM':
      return 'https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67';
    default:
      return '/unknown-token-image.png';
  }
}

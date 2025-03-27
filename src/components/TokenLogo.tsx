import { zeroAddress } from 'viem';
import { TokenInfo } from '../types';

export interface TokenLogoProps {
  token: TokenInfo | undefined;
  size?: 24 | 40;
}

/**
 * https://tokens.uniswap.org/
 */
const tokenList = [
  {
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    decimals: 18,
    chainId: 56,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    extensions: {
      bridgeInfo: {
        '1': {
          tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        },
      },
    },
  },
  {
    chainId: 56,
    address: zeroAddress,
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
  },
];

export const TokenLogo = ({ token, size = 40 }: TokenLogoProps) => {
  if (!token?.address) {
    return (
      <div style={{ width: size, height: size }}>
        <img src='/common-token.svg' alt='common-token' />
      </div>
    );
  }

  const tokenInfo = tokenList.find(
    (t) => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === token.chainId
  );

  if (tokenInfo) {
    return (
      <div style={{ width: size, height: size }}>
        <img src={tokenInfo.logoURI} alt={tokenInfo.symbol} />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <img src={`/${token.address}.svg`} alt={token.symbol} />
    </div>
  );
};

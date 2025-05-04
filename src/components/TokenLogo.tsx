import { TokenInfo } from '../types';

export interface TokenLogoProps {
  token: TokenInfo | undefined;
  size?: 24 | 40;
}

export const TokenLogo = ({ token, size = 40 }: TokenLogoProps) => {
  if (!token?.address) {
    return (
      <div style={{ width: size, height: size }}>
        <img src='/common-token.svg' alt='common-token' />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <img src={token.image} alt={token.symbol} />
    </div>
  );
};

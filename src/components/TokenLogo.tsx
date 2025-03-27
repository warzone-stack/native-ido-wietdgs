import { Address } from 'viem';

export interface TokenLogoProps {
  address: Address | undefined;
  size?: 24 | 40;
}

export const TokenLogo = ({ address, size = 40 }: TokenLogoProps) => {
  if (!address) {
    return (
      <div style={{ width: size, height: size }}>
        <img src='/common-token.svg' alt='common-token' />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <img src={`/${address}.svg`} alt={address} />
    </div>
  );
};

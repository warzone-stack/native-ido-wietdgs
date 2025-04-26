// 判断是否为 OKX 钱包
export const isOKXWallet = () => {
  return (window.solana?.isOkxWallet as boolean | undefined) ?? false;
};

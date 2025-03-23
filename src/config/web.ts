// 判断是否为 OKX 钱包
export const isOKXWallet = () => {
  // 以下判断只在 production 环境下生效
  if (import.meta.env.PROD) {
    return (window.ethereum?.isOKXWallet as boolean | undefined) ?? false;
  }

  return true;
};

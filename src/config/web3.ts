import { useEffect } from 'react';

import { useState } from 'react';

// 判断是否为 OKX 钱包
export const isOKXWallet = () => {
  console.log('PROD:', import.meta.env.PROD);
  console.log('ethereum:', window.ethereum);
  console.log('okxwallet:', (window as any).okxwallet);
  console.log('isOKXWallet:', window.ethereum?.isOKXWallet);
  console.log('isOkxWallet:', window.ethereum?.isOkxWallet);
  console.log('isOKExWallet:', window.ethereum?.isOKExWallet);
  console.log('providers:', window.ethereum?.providers);

  if (import.meta.env.PROD) {
    const eth = (window as any).ethereum;
    if ((window as any).okxwallet) return true;
    if (eth?.isOKXWallet || eth?.isOkxWallet || eth?.isOKExWallet) return true;
    if (Array.isArray(eth?.providers)) {
      return eth.providers.some((p: any) => p.isOKXWallet || p.isOkxWallet || p.isOKExWallet);
    }
    return false;
  }

  return true;
};

export const useIsOKXWallet = () => {
  const [isOKX, setIsOKX] = useState(false);

  useEffect(() => {
    // 钱包注入通常在页面加载后
    const check = () => {
      console.log('PROD:', import.meta.env.PROD);
      console.log('ethereum:', window.ethereum);
      console.log('okxwallet:', (window as any).okxwallet);
      console.log('isOKXWallet:', window.ethereum?.isOKXWallet);
      console.log('isOkxWallet:', window.ethereum?.isOkxWallet);
      console.log('isOKExWallet:', window.ethereum?.isOKExWallet);
      console.log('providers:', window.ethereum?.providers);

      if (import.meta.env.PROD) {
        const eth = (window as any).ethereum;
        if ((window as any).okxwallet) return setIsOKX(true);
        if (eth?.isOKXWallet || eth?.isOkxWallet || eth?.isOKExWallet) return setIsOKX(true);
        if (Array.isArray(eth?.providers)) {
          if (eth.providers.some((p: any) => p.isOKXWallet || p.isOkxWallet || p.isOKExWallet)) {
            return setIsOKX(true);
          }
        }
        setIsOKX(false);
      } else {
        setIsOKX(true);
      }
    };

    // 等待页面加载
    if (document.readyState === 'complete') {
      check();
    } else {
      window.addEventListener('load', check);
      return () => window.removeEventListener('load', check);
    }
  }, []);

  return isOKX;
};

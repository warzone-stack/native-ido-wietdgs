import { MintLayout } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import React from 'react';
import {
  SOL_MINT_ADDRESS,
  TOKEN_METADATA_PROGRAM_ID,
  WSOL_MINT_ADDRESS,
} from '../config/contracts';
import { byWei } from '../config/number';
import { getTokenImage } from '../config/token';
import { TokenInfo } from '../types';

export function useSolanaConnection() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const fetchSOLBalance = async () => {
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const result = await connection.getBalance(wallet.publicKey);
    const amountBg = byWei(result, 9);
    return {
      amount: amountBg,
      decimals: 9,
      uiAmount: amountBg.toNumber(),
      uiAmountString: amountBg.toString(),
    };
  };

  const fetchTokenBalance = async (address: string) => {
    if (address.toLowerCase() === SOL_MINT_ADDRESS.toLowerCase()) {
      return fetchSOLBalance();
    }
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const mintAccount = new PublicKey(address);
    const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
      mint: mintAccount,
    });
    if (tokenAccounts.value.length === 0) {
      return {
        amount: new BigNumber(0),
      };
    }
    const tokenAccount = tokenAccounts.value?.[0]?.pubkey;
    const result = await connection.getTokenAccountBalance(tokenAccount);
    return {
      amount: byWei(result.value.amount, result.value.decimals),
      ...result,
    };
  };

  const fetchBlockNumber = React.useCallback(async () => {
    if (!wallet.publicKey) {
      throw new Error('publicKey is undefined');
    }
    const result = await connection.getBlockHeight();
    return result;
  }, [connection, wallet]);

  const fetchTokenInfo = async ({
    mint,
    chainId,
    symbol,
  }: {
    mint: string | PublicKey | undefined;
    chainId: Cluster;
    symbol?: string;
  }): Promise<TokenInfo> => {
    if (!mint) {
      throw new Error('please input mint');
    }
    const mintStr = mint.toString();
    console.log('mintStr', mintStr, chainId, symbol);

    if (
      mintStr.toUpperCase() === 'SOL' ||
      mintStr.toLowerCase() === SOL_MINT_ADDRESS.toLowerCase()
    ) {
      return {
        chainId,
        address: SOL_MINT_ADDRESS,
        name: 'SOL',
        decimals: 9,
        symbol: 'SOL',
        image: getTokenImage(SOL_MINT_ADDRESS),
      };
    }

    if (
      mintStr.toUpperCase() === 'WSOL' ||
      mintStr.toLowerCase() === WSOL_MINT_ADDRESS.toLowerCase()
    ) {
      return {
        chainId,
        address: WSOL_MINT_ADDRESS,
        name: 'Wrapped SOL',
        decimals: 9,
        symbol: 'SOL',
        image: getTokenImage(WSOL_MINT_ADDRESS),
      };
    }

    const onlineInfo = await connection.getAccountInfo(new PublicKey(mintStr));
    if (!onlineInfo) {
      throw new Error(`mint address not found: ${mintStr}`);
    }
    const data = MintLayout.decode(onlineInfo.data);
    console.log('onlineInfo', onlineInfo, data);

    let mintSymbol = symbol ?? mintStr.toString().substring(0, 6);
    if (!symbol) {
      const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;

      try {
        // 计算 metadata PDA
        const [metadataPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('metadata'),
            // new Uint8Array([109, 101, 116, 97, 100, 97, 116, 97]), // 'metadata' in ASCII
            new PublicKey(TOKEN_METADATA_PROGRAM_ID).toBuffer(),
            mintPubkey.toBuffer(),
          ],
          new PublicKey(TOKEN_METADATA_PROGRAM_ID)
        );

        // 获取账户数据
        const accountInfo = await connection.getAccountInfo(metadataPDA);
        if (!accountInfo) {
          throw new Error('Metadata account not found');
        }

        // 跳过 key(1) + updateAuthority(32) + mint(32)
        let offset = 1 + 32 + 32;

        // 读取名称长度（4字节）
        const nameLength = accountInfo.data.readUInt32LE(offset);
        offset += 4;

        // 跳过名称
        offset += nameLength;

        // 读取 symbol 长度（4字节）
        const symbolLength = accountInfo.data.readUInt32LE(offset);
        offset += 4;

        // 读取 symbol
        const metaSymbol = accountInfo.data
          .slice(offset, offset + symbolLength)
          .toString('utf8')
          .trim();
        mintSymbol = metaSymbol;
      } catch (error) {
        console.error('Error fetching metadata:', mint, error);
      }
    }

    const fullInfo = {
      chainId,
      address: mintStr,
      programId: onlineInfo.owner.toBase58(),
      logoURI: '',
      symbol: mintSymbol,
      name: mintSymbol,
      decimals: data.decimals,
      tags: [],
      extensions: {},
      priority: 0,
      type: 'unknown',
      image: getTokenImage(mint),
    };
    console.log('fullInfo', fullInfo);
    return fullInfo;
  };

  return {
    fetchSOLBalance,
    fetchTokenBalance,
    fetchBlockNumber,
    fetchTokenInfo,
  };
}

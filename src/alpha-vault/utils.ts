import { Connection, PublicKey } from '@solana/web3.js';
import { parse } from 'csv-parse/browser/esm';
import Decimal from 'decimal.js';
import { BalanceTree } from './merkle_tree';
import { AlphaVault } from '.';
import { BN } from '@coral-xyz/anchor';

type WhitelistWallet = {
  wallet: string;
  deposit_cap: string;
};

type ParsedWhitelistWallet = {
  wallet: PublicKey;
  depositCap: Decimal;
};

export async function loadWhitelistWalletCsv(csvPath: string): Promise<ParsedWhitelistWallet[]> {
  //   const csvFile = `wallet,deposit_cap
  // CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n,0.12345
  // F1cc1ERkurVLT4Sn4AcsmCLWBrXNSjbDJUuszi4jWNii,0.2`;

  //   parse(
  //     `wallet,deposit_cap
  // CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n,0.12345
  // F1cc1ERkurVLT4Sn4AcsmCLWBrXNSjbDJUuszi4jWNii,0.2`,
  //     (err, records) => {
  //       console.log(records);
  //     }
  //   );

  const response = await fetch(csvPath);
  const csvFile = await response.text();

  return new Promise((res, rej) => {
    parse(
      csvFile,
      {
        delimiter: ',',
        columns: ['wallet', 'deposit_cap'],
      },
      (err, data: WhitelistWallet[]) => {
        if (err) {
          console.error('loadWhitelistWalletCsv error', err);
        }
        console.log('loadWhitelistWalletCsv data', data);

        if (err) {
          rej(err);
        } else {
          // Remove header
          data.shift();
          res(
            data.map((d) => {
              return {
                wallet: new PublicKey(d.wallet),
                depositCap: new Decimal(d.deposit_cap.toString()),
              };
            })
          );
        }
      }
    );
  });
}

export const createMerkleTree = async (
  connection: Connection,
  alphaVault: AlphaVault,
  whitelistedWallets: ParsedWhitelistWallet[]
) => {
  const quoteMint = await connection.getTokenSupply(alphaVault.vault.quoteMint);
  const toNativeAmountMultiplier = new Decimal(10 ** quoteMint.value.decimals);
  const tree = new BalanceTree(
    whitelistedWallets.map((info) => {
      return {
        account: info.wallet,
        maxCap: new BN(info.depositCap.mul(toNativeAmountMultiplier).toString()),
      };
    })
  );

  return tree;
};

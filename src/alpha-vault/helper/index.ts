import { BN } from '@coral-xyz/anchor';
import {
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';
import { Connection, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { SEED } from '../constant';
import { GetOrCreateATAResponse } from '../type';

export function deriveMerkleRootConfig(alphaVault: PublicKey, version: BN, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEED.merkleRoot),
      alphaVault.toBuffer(),
      new Uint8Array(version.toArrayLike(Buffer, 'le', 8)),
    ],
    programId
  );
}

export function deriveEscrow(alphaVault: PublicKey, owner: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      new Uint8Array([...SEED.escrow].map((c) => c.charCodeAt(0))),
      alphaVault.toBuffer(),
      owner.toBuffer(),
    ],
    programId
  );
}

export const getOrCreateATAInstruction = async (
  connection: Connection,
  tokenMint: PublicKey,
  owner: PublicKey,
  payer: PublicKey = owner,
  allowOwnerOffCurve = true
): Promise<GetOrCreateATAResponse> => {
  const toAccount = getAssociatedTokenAddressSync(tokenMint, owner, allowOwnerOffCurve);

  try {
    await getAccount(connection, toAccount);

    return { ataPubKey: toAccount, ix: undefined };
  } catch (e) {
    if (e instanceof TokenAccountNotFoundError || e instanceof TokenInvalidAccountOwnerError) {
      const ix = createAssociatedTokenAccountInstruction(payer, toAccount, owner, tokenMint);

      return { ataPubKey: toAccount, ix };
    } else {
      /* handle error */
      console.error('Error::getOrCreateATAInstruction', e);
      throw e;
    }
  }
};

export const wrapSOLInstruction = (
  from: PublicKey,
  to: PublicKey,
  amount: bigint
): TransactionInstruction[] => {
  return [
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount,
    }),
    new TransactionInstruction({
      keys: [
        {
          pubkey: to,
          isSigner: false,
          isWritable: true,
        },
      ],
      data: Buffer.from(new Uint8Array([17])),
      programId: TOKEN_PROGRAM_ID,
    }),
  ];
};

export const unwrapSOLInstruction = (owner: PublicKey) => {
  const wSolATAAccount = getAssociatedTokenAddressSync(NATIVE_MINT, owner, true);
  if (wSolATAAccount) {
    const closedWrappedSolInstruction = createCloseAccountInstruction(wSolATAAccount, owner, owner);
    return closedWrappedSolInstruction;
  }
  return null;
};

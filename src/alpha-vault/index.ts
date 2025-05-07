import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import {
  Cluster,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  ALPHA_VAULT_TREASURY_ID,
  Permissionless,
  PermissionWithMerkleProof,
  PROGRAM_ID,
} from './constant';
import { CLUSTER } from '../config/contracts';
import { IDL } from './idl';
import {
  AlphaVaultProgram,
  CustomizableFcfsVaultParams,
  CustomizableProrataVaultParams,
  DepositInfo,
  DepositWithProofParams,
  Escrow,
  PoolType,
  Vault,
  VaultMode,
  VaultParam,
  WalletDepositCap,
} from './type';
import {
  deriveEscrow,
  getOrCreateATAInstruction,
  unwrapSOLInstruction,
  wrapSOLInstruction,
} from './helper';
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// 不能导入 @meteora-ag/alpha-vault, 会报错 state.ts:14 Uncaught ReferenceError: Buffer is not defined

type Opt = {
  cluster: Cluster;
};

export class AlphaVault {
  constructor(
    public program: AlphaVaultProgram,
    public pubkey: PublicKey,
    public vault: Vault,
    public mode: VaultMode
  ) {}

  /**
   * Creates an AlphaVault instance from a given vault address.
   *
   * @param {Connection} connection - The Solana connection to use.
   * @param {PublicKey} vaultAddress - The address of the vault to create an instance for.
   * @param {Opt} [opt] - Optional configuration options.
   * @return {Promise<AlphaVault>} A promise resolving to the created AlphaVault instance.
   */
  public static async create(
    connection: Connection,
    vaultAddress: PublicKey,
    opt?: Opt
  ): Promise<AlphaVault> {
    const provider = new AnchorProvider(connection, {} as any, AnchorProvider.defaultOptions());
    const program = new Program(IDL, PROGRAM_ID[opt?.cluster || CLUSTER], provider);

    const vault = await program.account.vault.fetch(vaultAddress);
    const vaultMode = vault.vaultMode === 0 ? VaultMode.PRORATA : VaultMode.FCFS;

    return new AlphaVault(program, vaultAddress, vault, vaultMode);
  }

  /**
   * Retrieves the escrow account associated with the given owner.
   *
   * @param {PublicKey} owner - The public key of the owner.
   * @return {Promise<Escrow | null>} A promise containing the escrow account, or null if not found.
   */
  public async getEscrow(owner: PublicKey): Promise<Escrow | null> {
    const [escrow] = deriveEscrow(this.pubkey, owner, this.program.programId);
    const escrowAccount = await this.program.account.escrow.fetchNullable(escrow);

    return escrowAccount;
  }

  /**
   * Deposits a specified amount of tokens into the vault.
   *
   * @param {BN} maxAmount - The maximum amount of tokens to deposit.
   * @param {PublicKey} owner - The public key of the owner's wallet.
   * @param {DepositWithProofParams} [depositProof] - The deposit proof parameters. Required for permisisoned vault.
   * @return {Promise<Transaction>} A promise that resolves to the deposit transaction.
   */
  public async deposit(
    maxAmount: BN,
    owner: PublicKey,
    depositProof?: DepositWithProofParams
  ): Promise<Transaction> {
    const [escrow] = deriveEscrow(this.pubkey, owner, this.program.programId);
    const escrowAccount = await this.program.account.escrow.fetchNullable(escrow);

    const preInstructions: TransactionInstruction[] = [];
    if (!escrowAccount) {
      if (this.vault.whitelistMode === PermissionWithMerkleProof) {
        const { merkleRootConfig, maxCap, proof } = depositProof;

        const createEscrowTx = await this.program.methods
          .createPermissionedEscrow(maxCap, proof)
          .accounts({
            merkleRootConfig,
            vault: this.pubkey,
            pool: this.vault.pool,
            escrow,
            owner,
            payer: owner,
            systemProgram: SystemProgram.programId,
            escrowFeeReceiver: ALPHA_VAULT_TREASURY_ID,
          })
          .instruction();
        preInstructions.push(createEscrowTx);
      } else if (this.vault.whitelistMode === Permissionless) {
        const createEscrowTx = await this.program.methods
          .createNewEscrow()
          .accounts({
            vault: this.pubkey,
            escrow,
            owner,
            payer: owner,
            systemProgram: SystemProgram.programId,
            pool: this.vault.pool,
            escrowFeeReceiver: ALPHA_VAULT_TREASURY_ID,
          })
          .instruction();
        preInstructions.push(createEscrowTx);
      }
    }

    const [
      { ataPubKey: sourceToken, ix: createSourceTokenIx },
      { ix: createBaseTokenIx },
      { ix: createTokenVaultIx },
    ] = await Promise.all([
      getOrCreateATAInstruction(this.program.provider.connection, this.vault.quoteMint, owner),
      getOrCreateATAInstruction(this.program.provider.connection, this.vault.baseMint, owner),
      getOrCreateATAInstruction(
        this.program.provider.connection,
        this.vault.quoteMint,
        this.pubkey,
        owner
      ),
    ]);
    if (createSourceTokenIx) {
      preInstructions.push(createSourceTokenIx);
    }
    if (createBaseTokenIx) {
      preInstructions.push(createBaseTokenIx);
    }
    if (createTokenVaultIx) {
      preInstructions.push(createTokenVaultIx);
    }

    const postInstructions: TransactionInstruction[] = [];
    if (this.vault.quoteMint.equals(NATIVE_MINT)) {
      preInstructions.push(...wrapSOLInstruction(owner, sourceToken, BigInt(maxAmount.toString())));
      postInstructions.push(unwrapSOLInstruction(owner));
    }

    const depositTx = await this.program.methods
      .deposit(maxAmount)
      .accounts({
        vault: this.pubkey,
        escrow,
        sourceToken,
        tokenVault: this.vault.tokenVault,
        tokenMint: this.vault.quoteMint,
        pool: this.vault.pool,
        owner,
      })
      .preInstructions(preInstructions)
      .postInstructions(postInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.program.provider.connection.getLatestBlockhash('confirmed');
    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(depositTx);
  }

  /**
   * Withdraws the remaining quote from the vault.
   *
   * @param {PublicKey} owner - The public key of the owner's wallet.
   * @return {Promise<Transaction>} A promise that resolves to the withdraw transaction.
   */
  public async withdrawRemainingQuote(owner: PublicKey) {
    const [escrow] = deriveEscrow(this.pubkey, owner, this.program.programId);

    const preInstructions: TransactionInstruction[] = [];
    const { ataPubKey: destinationToken, ix: createDestinationTokenIx } =
      await getOrCreateATAInstruction(
        this.program.provider.connection,
        this.vault.quoteMint,
        owner
      );
    if (createDestinationTokenIx) {
      preInstructions.push(createDestinationTokenIx);
    }

    const withdrawRemainingTx = await this.program.methods
      .withdrawRemainingQuote()
      .accounts({
        vault: this.pubkey,
        escrow,
        owner,
        destinationToken,
        pool: this.vault.pool,
        tokenVault: this.vault.tokenVault,
        tokenMint: this.vault.quoteMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.program.provider.connection.getLatestBlockhash('confirmed');
    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(withdrawRemainingTx);
  }

  /**
   * Claims bought token from the vault.
   *
   * @param {PublicKey} owner - The public key of the owner's wallet.
   * @return {Promise<Transaction>} A promise that resolves to the claim transaction.
   */
  public async claimToken(owner: PublicKey) {
    const [escrow] = deriveEscrow(this.pubkey, owner, this.program.programId);

    const preInstructions: TransactionInstruction[] = [];
    const { ataPubKey: destinationToken, ix: createDestinationTokenIx } =
      await getOrCreateATAInstruction(this.program.provider.connection, this.vault.baseMint, owner);
    if (createDestinationTokenIx) {
      preInstructions.push(createDestinationTokenIx);
    }

    const claimTokenTx = await this.program.methods
      .claimToken()
      .accounts({
        vault: this.pubkey,
        escrow,
        owner,
        destinationToken,
        tokenOutVault: this.vault.tokenOutVault,
        tokenMint: this.vault.baseMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.program.provider.connection.getLatestBlockhash('confirmed');
    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(claimTokenTx);
  }

  /**
   * Retrieves deposit information for the given escrow account.
   *
   * @param {Escrow | null} escrowAccount - The escrow account to retrieve deposit information for.
   * @return {Promise<DepositInfo>} A promise that resolves to the deposit information, including total deposit, total filled, and total returned.
   */
  public async getDepositInfo(escrowAccount: Escrow | null): Promise<DepositInfo> {
    if (!escrowAccount) {
      return {
        totalDeposit: new BN(0),
        totalFilled: new BN(0),
        totalReturned: new BN(0),
      };
    }

    const remainingAmount = this.vault.totalDeposit.sub(this.vault.swappedAmount);
    const totalReturned = remainingAmount
      .mul(escrowAccount.totalDeposit)
      .div(this.vault.totalDeposit);

    const totalFilled = escrowAccount.totalDeposit.sub(totalReturned);

    return {
      totalDeposit: escrowAccount.totalDeposit,
      totalFilled,
      totalReturned,
    };
  }
}

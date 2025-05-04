import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from './constant';
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
}

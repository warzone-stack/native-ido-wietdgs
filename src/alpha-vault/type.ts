import { BN, IdlAccounts, Program } from '@coral-xyz/anchor';
import { AlphaVault } from './idl';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { WhitelistMode } from './constant';

export interface GetOrCreateATAResponse {
  ataPubKey: PublicKey;
  ix?: TransactionInstruction;
}

export interface DepositWithProofParams {
  merkleRootConfig: PublicKey;
  maxCap: BN;
  proof: number[][];
}

export interface DepositInfo {
  // Total deposit amount
  totalDeposit: BN;
  // Total consumed deposit amount for bought token
  totalFilled: BN;
  // Total remaining deposit amount to be returned
  totalReturned: BN;
}

export interface WalletDepositCap {
  address: PublicKey;
  maxAmount: BN;
}

export interface VaultParam {
  quoteMint: PublicKey;
  baseMint: PublicKey;
  poolAddress: PublicKey;
  poolType: PoolType;
  vaultMode: VaultMode;
  config: PublicKey;
}

export interface CustomizableFcfsVaultParams {
  quoteMint: PublicKey;
  baseMint: PublicKey;
  poolAddress: PublicKey;
  poolType: PoolType;
  depositingPoint: BN;
  startVestingPoint: BN;
  endVestingPoint: BN;
  maxDepositingCap: BN;
  individualDepositingCap: BN;
  escrowFee: BN;
  whitelistMode: WhitelistMode;
}

export interface CustomizableProrataVaultParams {
  quoteMint: PublicKey;
  baseMint: PublicKey;
  poolAddress: PublicKey;
  poolType: PoolType;
  depositingPoint: BN;
  startVestingPoint: BN;
  endVestingPoint: BN;
  maxBuyingCap: BN;
  escrowFee: BN;
  whitelistMode: WhitelistMode;
}

export type AlphaVaultProgram = Program<AlphaVault>;

/**
 "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "docs": [
              "pool"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "docs": [
              "reserve quote token"
            ],
            "type": "publicKey"
          },
          {
            "name": "tokenOutVault",
            "docs": [
              "reserve base token"
            ],
            "type": "publicKey"
          },
          {
            "name": "quoteMint",
            "docs": [
              "quote token"
            ],
            "type": "publicKey"
          },
          {
            "name": "baseMint",
            "docs": [
              "base token"
            ],
            "type": "publicKey"
          },
          {
            "name": "base",
            "docs": [
              "base key"
            ],
            "type": "publicKey"
          },
          {
            "name": "owner",
            "docs": [
              "owner key, deprecated field, can re-use in the future"
            ],
            "type": "publicKey"
          },
          {
            "name": "maxBuyingCap",
            "docs": [
              "max buying cap"
            ],
            "type": "u64"
          },
          {
            "name": "totalDeposit",
            "docs": [
              "total deposited quote token"
            ],
            "type": "u64"
          },
          {
            "name": "totalEscrow",
            "docs": [
              "total user deposit"
            ],
            "type": "u64"
          },
          {
            "name": "swappedAmount",
            "docs": [
              "swapped_amount"
            ],
            "type": "u64"
          },
          {
            "name": "boughtToken",
            "docs": [
              "total bought token"
            ],
            "type": "u64"
          },
          {
            "name": "totalRefund",
            "docs": [
              "Total quote refund"
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimedToken",
            "docs": [
              "Total claimed_token"
            ],
            "type": "u64"
          },
          {
            "name": "startVestingPoint",
            "docs": [
              "Start vesting ts"
            ],
            "type": "u64"
          },
          {
            "name": "endVestingPoint",
            "docs": [
              "End vesting ts"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "bump"
            ],
            "type": "u8"
          },
          {
            "name": "poolType",
            "docs": [
              "pool type"
            ],
            "type": "u8"
          },
          {
            "name": "vaultMode",
            "docs": [
              "vault mode"
            ],
            "type": "u8"
          },
          {
            "name": "padding0",
            "docs": [
              "padding 0"
            ],
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "maxDepositingCap",
            "docs": [
              "max depositing cap"
            ],
            "type": "u64"
          },
          {
            "name": "individualDepositingCap",
            "docs": [
              "individual depositing cap"
            ],
            "type": "u64"
          },
          {
            "name": "depositingPoint",
            "docs": [
              "depositing point"
            ],
            "type": "u64"
          },
          {
            "name": "escrowFee",
            "docs": [
              "flat fee when user open an escrow"
            ],
            "type": "u64"
          },
          {
            "name": "totalEscrowFee",
            "docs": [
              "total escrow fee just for statistic"
            ],
            "type": "u64"
          },
          {
            "name": "whitelistMode",
            "docs": [
              "deposit whitelist mode"
            ],
            "type": "u8"
          },
          {
            "name": "activationType",
            "docs": [
              "activation type"
            ],
            "type": "u8"
          },
          {
            "name": "padding1",
            "docs": [
              "padding 1"
            ],
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "vaultAuthority",
            "docs": [
              "vault authority normally is vault creator, will be able to create merkle root config"
            ],
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u128",
                5
              ]
            }
          }
        ]
      }
 */
export type Vault = IdlAccounts<AlphaVault>['vault'];
export type Escrow = IdlAccounts<AlphaVault>['escrow'];
export type FCFSConfig = IdlAccounts<AlphaVault>['fcfsVaultConfig'];
export type ProrataConfig = IdlAccounts<AlphaVault>['prorataVaultConfig'];

export enum VaultMode {
  PRORATA,
  FCFS,
}

export enum PoolType {
  DLMM,
  DYNAMIC,
}

export enum ActivationType {
  SLOT,
  TIMESTAMP,
}

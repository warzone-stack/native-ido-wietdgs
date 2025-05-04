import { useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { AlphaVault } from '../alpha-vault';
import { VAULT_ADDRESS } from '../config/contracts';
import { VaultContext } from './VaultContext';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();

  const { data: vault, refetch } = useQuery({
    queryKey: ['vault', VAULT_ADDRESS],
    queryFn: async () => {
      const vault = await AlphaVault.create(connection, VAULT_ADDRESS);
      if (vault) {
        // pool: 池子的公钥 (Pool public key)
        console.log(
          'pool:',
          vault.vault.pool instanceof PublicKey ? vault.vault.pool.toBase58() : vault.vault.pool
        );
        // tokenVault: 储备报价币的账户 (Reserve quote token account)
        console.log(
          'tokenVault:',
          vault.vault.tokenVault instanceof PublicKey
            ? vault.vault.tokenVault.toBase58()
            : vault.vault.tokenVault
        );
        // tokenOutVault: 储备基础币的账户 (Reserve base token account)
        console.log(
          'tokenOutVault:',
          vault.vault.tokenOutVault instanceof PublicKey
            ? vault.vault.tokenOutVault.toBase58()
            : vault.vault.tokenOutVault
        );
        // quoteMint: 报价币的 mint (Quote token mint)
        console.log(
          'quoteMint:',
          vault.vault.quoteMint instanceof PublicKey
            ? vault.vault.quoteMint.toBase58()
            : vault.vault.quoteMint
        );
        // baseMint: 基础币的 mint (Base token mint)
        console.log(
          'baseMint:',
          vault.vault.baseMint instanceof PublicKey
            ? vault.vault.baseMint.toBase58()
            : vault.vault.baseMint
        );
        // base: 基础币 key (Base key)
        // pool -> vaultConfigKey
        console.log(
          'base:',
          vault.vault.base instanceof PublicKey ? vault.vault.base.toBase58() : vault.vault.base
        );
        // owner: 拥有者 key，已废弃字段 (Owner key, deprecated field)
        console.log(
          'owner:',
          vault.vault.owner instanceof PublicKey ? vault.vault.owner.toBase58() : vault.vault.owner
        );
        // maxBuyingCap: 最大购买上限 (Max buying cap)
        console.log(
          'maxBuyingCap:',
          BN.isBN(vault.vault.maxBuyingCap)
            ? vault.vault.maxBuyingCap.toString()
            : vault.vault.maxBuyingCap
        );
        // totalDeposit: 总共存入的报价币数量 (Total deposited quote token)
        console.log(
          'totalDeposit:',
          BN.isBN(vault.vault.totalDeposit)
            ? vault.vault.totalDeposit.toString()
            : vault.vault.totalDeposit
        );
        // totalEscrow: 用户总存入 (Total user deposit)
        console.log(
          'totalEscrow:',
          BN.isBN(vault.vault.totalEscrow)
            ? vault.vault.totalEscrow.toString()
            : vault.vault.totalEscrow
        );
        // swappedAmount: 已兑换数量 (Swapped amount)
        console.log(
          'swappedAmount:',
          BN.isBN(vault.vault.swappedAmount)
            ? vault.vault.swappedAmount.toString()
            : vault.vault.swappedAmount
        );
        // boughtToken: 已购买的基础币总量 (Total bought token)
        console.log(
          'boughtToken:',
          BN.isBN(vault.vault.boughtToken)
            ? vault.vault.boughtToken.toString()
            : vault.vault.boughtToken
        );
        // totalRefund: 总退款报价币 (Total quote refund)
        console.log(
          'totalRefund:',
          BN.isBN(vault.vault.totalRefund)
            ? vault.vault.totalRefund.toString()
            : vault.vault.totalRefund
        );
        // totalClaimedToken: 已领取的基础币总量 (Total claimed token)
        console.log(
          'totalClaimedToken:',
          BN.isBN(vault.vault.totalClaimedToken)
            ? vault.vault.totalClaimedToken.toString()
            : vault.vault.totalClaimedToken
        );
        // startVestingPoint: 开始释放时间戳 (Start vesting timestamp)
        console.log(
          'startVestingPoint:',
          BN.isBN(vault.vault.startVestingPoint)
            ? vault.vault.startVestingPoint.toString()
            : vault.vault.startVestingPoint
        );
        // endVestingPoint: 结束释放时间戳 (End vesting timestamp)
        console.log(
          'endVestingPoint:',
          BN.isBN(vault.vault.endVestingPoint)
            ? vault.vault.endVestingPoint.toString()
            : vault.vault.endVestingPoint
        );
        // bump: bump 值 (Bump value)
        console.log('bump:', vault.vault.bump);
        // poolType: 池子类型 (Pool type)
        console.log('poolType:', vault.vault.poolType);
        // vaultMode: 金库模式 (Vault mode)
        console.log('vaultMode:', vault.vault.vaultMode);
        // padding0: 填充字段0 (Padding 0)
        console.log('padding0:', vault.vault.padding0);
        // maxDepositingCap: 最大存入上限 (Max depositing cap)
        console.log(
          'maxDepositingCap:',
          BN.isBN(vault.vault.maxDepositingCap)
            ? vault.vault.maxDepositingCap.toString()
            : vault.vault.maxDepositingCap
        );
        // individualDepositingCap: 单用户最大存入上限 (Individual depositing cap)
        console.log(
          'individualDepositingCap:',
          BN.isBN(vault.vault.individualDepositingCap)
            ? vault.vault.individualDepositingCap.toString()
            : vault.vault.individualDepositingCap
        );
        // depositingPoint: 存入时间点 (Depositing point)
        console.log(
          'depositingPoint:',
          BN.isBN(vault.vault.depositingPoint)
            ? vault.vault.depositingPoint.toString()
            : vault.vault.depositingPoint
        );
        // escrowFee: 开启托管时的固定手续费 (Flat fee when user open an escrow)
        console.log(
          'escrowFee:',
          BN.isBN(vault.vault.escrowFee) ? vault.vault.escrowFee.toString() : vault.vault.escrowFee
        );
        // totalEscrowFee: 统计用的总托管手续费 (Total escrow fee for statistic)
        console.log(
          'totalEscrowFee:',
          BN.isBN(vault.vault.totalEscrowFee)
            ? vault.vault.totalEscrowFee.toString()
            : vault.vault.totalEscrowFee
        );
        // whitelistMode: 白名单模式 (Whitelist mode)
        console.log('whitelistMode:', vault.vault.whitelistMode);
        // activationType: 激活类型 (Activation type)
        console.log('activationType:', vault.vault.activationType);
        // padding1: 填充字段1 (Padding 1)
        console.log('padding1:', vault.vault.padding1);
        // vaultAuthority: 金库管理员 (Vault authority)
        // vault authority normally is vault creator, will be able to create merkle root config
        console.log(
          'vaultAuthority:',
          vault.vault.vaultAuthority instanceof PublicKey
            ? vault.vault.vaultAuthority.toBase58()
            : vault.vault.vaultAuthority
        );
        // padding: 填充字段 (Padding)
        // console.log('padding:', vault.vault.padding);
      }
      return vault;
    },
    refetchInterval: 15000,
  });

  return (
    <VaultContext.Provider value={{ vault, refetchVault: refetch }}>
      {children}
    </VaultContext.Provider>
  );
};

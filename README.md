# DEX App

A decentralized exchange (DEX) application built with React, TypeScript, and Wagmi.

## Features

- Connect wallet using RainbowKit
- Dark mode support
- Modern UI with Tailwind CSS
- Type-safe with TypeScript
- Interact with Ethereum smart contracts

## Setup

1. Install dependencies:
```bash
yarn
```

2. Create a `.env` file and add your WalletConnect project ID:
```bash
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

3. Install Solana dependencies:
```bash
yarn add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui
```

4. Start the development server:
```bash
yarn dev
```


## alpha-vault sdk 调用创建 pool 和 vault:
```
createDynamicPoolWithPermissionlessVault PublicKey [PublicKey(CVVQYs9Pi3t4it4KFpm3hxk97uDA6AVzNVJvGQTPH17n)] {
  _bn: <BN: aabcf009056ce8756315fdfa8e2ae55bae2395d4b7089b9a68fc2d6e68ced9e9>
}

SOL balance 5.52739004
mintAInfo PublicKey [PublicKey(aiy9XpdqsABsLnBvvDwefTLfcZjokNFqLDeD3gGhCRc)] {
  _bn: <BN: 8a39ec0c07be64be3e4be67830ddeab64fd105fee3eb41148f984081e45af2f>
}
https://solscan.io/token/aiy9XpdqsABsLnBvvDwefTLfcZjokNFqLDeD3gGhCRc?cluster=devnet
Token Account https://explorer.solana.com/address/2ZRnCi9mVQ7zpFmYmVua6tH5k2rx4kpoARPFfQ4oRtgr?cluster=devnet
mintBInfo PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
  _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
}
Gotten 8 usable pool configs with vault support
Got pool config
{
  publicKey: PublicKey [PublicKey(38cy1kpruGc3Xbni4fUF2W1dyh4EbJ4LzccdpnPZxhJk)] {
    _bn: <BN: 1fab1b2a09a89275b8cd2f57c8d14a6f0aa0ee7f4ede8d944f1e5fedec7e0abd>
  },
  account: {
    poolFees: {
      tradeFeeNumerator: <BN: 3a98>,
      tradeFeeDenominator: <BN: 186a0>,
      protocolTradeFeeNumerator: <BN: 4e20>,
      protocolTradeFeeDenominator: <BN: 186a0>
    },
    activationDuration: <BN: 93a80>,
    vaultConfigKey: PublicKey [PublicKey(DxFmi5KH9eqykWAeQ4E7Xughf2TT3nuSpS3zbFYZGGbW)] {
      _bn: <BN: c073e39893000c27aa4acb6f01bc8c87a84405872c81e0c9785b07d9328ecb25>
    },
    poolCreatorAuthority: PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    },
    activationType: 1,
    partnerFeeNumerator: <BN: 0>,
    padding: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0,
      ... 119 more items
    ]
  }
}
Creating pool
7ttoPkAZBmyUgXSUnHGScEyhPFWdZisVCuAFJC7CtETcTM8UxfdpDkaDPJjWy2cHbtuktsMEqXZtNkDGJjgZLT8
2GYJAUD73r99Q969Yw6SbCWBsxtwodn3zKhXuNrnfC7cQ88yvfLy7mNuLF4NyExu9zZSxeZ32eMUDHVUEiDCGNSi
Pool created H3RS4uQK9Z1GndSNJhR3m1CSWFT3ENeJiyfWiokc8SBQ
Creating vault
38KR163KAqNAY8gf2yY2Sb5VunYhNkkLypVAJNsKzX9zmKyoECUgKS8s6RcUiMxAWirdUwFeqb1BAHWkiw3M6bgZ
Vault created 8PCjMuYBpWdjadterCxZmiSYg419GJFJEgHbtwZE81p2
Done


{
  "baseMint": {
    "type": "publicKey",
    "data": "aiy9XpdqsABsLnBvvDwefTLfcZjokNFqLDeD3gGhCRc"
  },
  "quoteMint": {
    "type": "publicKey",
    "data": "So11111111111111111111111111111111111111112"
  },
  "startVestingPoint": {
    "type": "u64",
    "data": "1746197258"
  },
  "endVestingPoint": {
    "type": "u64",
    "data": "1746200858"
  },
  "maxBuyingCap": {
    "type": "u64",
    "data": "1000000000000"
  },
  "pool": {
    "type": "publicKey",
    "data": "H3RS4uQK9Z1GndSNJhR3m1CSWFT3ENeJiyfWiokc8SBQ"
  },
  "poolType": {
    "type": "u8",
    "data": 1
  },
  "escrowFee": {
    "type": "u64",
    "data": "0"
  },
  "activationType": {
    "type": "u8",
    "data": 1
  }
}
```


```物料 
devnet 
8PCjMuYBpWdjadterCxZmiSYg419GJFJEgHbtwZE81p2 已结束
```
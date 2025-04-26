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
# Hermes - Cross-Chain Messaging Platform

## Project Overview

Hermes is a modern, intuitive cross-chain messaging platform that enables seamless communication between different
blockchain networks. The application provides a sleek interface for sending messages from one blockchain to another,
with real-time status updates and transaction history tracking.

This project currently only supports metamask as a clientside wallet. It uses hyperlane as the cross-chain engine. It
requires the user to connect metamask once when submitting their first message from a network. Every individual message
requires the user to approve two transactions. The first transaction initiates a cross-chain request using hyperlane's
Mailbox contract on the source-chain. The second transaction prompts a user to pay the relayer fees, that lets the
message get through to the destination chain. The recipient contract is currently harcoded to hyperlane's test recipient
as the assessment documentation did not specify that the user should be prompted for a recipient contract. This can be
changed quite easily with the addition of an input field.

### Note:

**Currently the destination chain transaction hash displays the message ID from hyperlane instead of the actual tx hash
on the destination chain. This is because hyperlane relayers are notoriously slow for testnets, sometimes taking upto 4
hours. The message ID does however provide a unique identifier for the message, and is only updated once the gas payment
goes through which always gaurantees that the transaction succeeded.**

### Key Features

- **Cross-Chain Messaging**: Send messages between supported blockchains (currently supporting Ethereum Sepolia to Fuji
  Testnet route)
- **Real-Time Transaction Tracking**: Monitor message delivery status across chains
- **Transaction History**: View and manage past cross-chain transactions
- **Responsive Design**: Fully responsive UI that works on all device sizes

## Tech Stack

### Frontend

- **React 19**: Latest version of the React library for building user interfaces
- **Next.js 15**: React framework with App Router for routing, layouts, and server components; bootstrapped with [
  `create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
- **TypeScript**: For type-safe code and better developer experience
- **Tailwind CSS 4**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for creating fluid UI transitions
- **Lucide React**: Lightweight icon library

### UI Components

- **shadcn/ui**: Component library built with Radix UI and Tailwind CSS
- **Radix UI**: Unstyled, accessible components for building high-quality UI
- **Class Variance Authority**: For creating variant components
- **Web3Icons**: For blockchain-related icons
- **Sonner**: Toast notification library

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **TW Animate CSS**: Additional animations for Tailwind
- **Tailwind Merge**: Utility for merging Tailwind CSS classes

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Contains the main application pages and layouts
- `/src/components/custom`: Custom components specifically created for the Hermes application
- `/src/components/ui`: Reusable UI components from shadcn/ui and other libraries
- `/src/lib`: Utility functions and shared logic

## Current Blockchain Support

Hermes currently supports sending messages between the following testnets:

- Ethereum Sepolia
- Fuji Testnet
- Arbitrum Sepolia (UI ready, backend integration pending)
- Base Sepolia (UI ready, backend integration pending)
- Polygon Amoy (UI ready, backend integration pending)

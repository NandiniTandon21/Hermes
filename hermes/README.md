# Hermes - Cross-Chain Messaging Platform

## Project Overview

Hermes is a modern, intuitive cross-chain messaging platform that enables seamless communication between different blockchain networks. The application provides a sleek interface for sending messages from one blockchain to another, with real-time status updates and transaction history tracking.

### Key Features

- **Cross-Chain Messaging**: Send messages between supported blockchains (currently supporting Ethereum Sepolia to Base Sepolia route)
- **Real-Time Transaction Tracking**: Monitor message delivery status across chains
- **Transaction History**: View and manage past cross-chain transactions
- **Responsive Design**: Fully responsive UI that works on all device sizes

## Tech Stack

### Frontend
- **React 19**: Latest version of the React library for building user interfaces
- **Next.js 15**: React framework with App Router for routing, layouts, and server components; bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
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
- Base Sepolia
- Arbitrum Sepolia (UI ready, backend integration pending)
- Optimism Sepolia (UI ready, backend integration pending)
- Polygon Amoy (UI ready, backend integration pending)

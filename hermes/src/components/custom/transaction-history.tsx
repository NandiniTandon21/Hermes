"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TransactionState } from "@/app/dashboard/page";
import { cn } from "@/lib/utils";
import { Clock, X, ArrowRightLeft, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const chainLabels: Record<string, string> = {
    'ethereum-sepolia': 'Ethereum Sepolia',
    'arbitrum-sepolia': 'Arbitrum Sepolia',
    'optimism-sepolia': 'Optimism Sepolia',
    'polygon-amoy': 'Polygon Amoy',
    'base-sepolia': 'Base Sepolia',
};

const chainColors: Record<string, string> = {
    'ethereum-sepolia': '#627EEA',
    'arbitrum-sepolia': '#28A0F0',
    'optimism-sepolia': '#FF0420',
    'polygon-amoy': '#8247E5',
    'base-sepolia': '#0052FF',
};

interface TransactionHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export default function TransactionHistory({
                                               isOpen,
                                               onClose,
                                               className
                                           }: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<TransactionState[]>([]);
    const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

    const modalRef = React.useRef<HTMLDivElement>(null);
    const isModalInView = useInView(modalRef, { once: true, amount: 0.2 });

    // Load transactions from localStorage on component mount
    useEffect(() => {
        if (typeof window === 'undefined' || !isOpen) return;

        try {
            const storedTransactions = localStorage.getItem('hermesTransactions');
            if (storedTransactions) {
                setTransactions(JSON.parse(storedTransactions));
            }
        } catch (error) {
            console.error("Failed to load transaction history:", error);
        }
    }, [isOpen]);

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return "Unknown date";
        return new Date(timestamp).toLocaleString();
    };

    const truncateHash = (hash: string | null) => {
        if (!hash) return "N/A";
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    const handleClearHistory = () => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem('hermesTransactions');
        setTransactions([]);
    };

    const toggleTransaction = (id: string) => {
        setExpandedTransaction(expandedTransaction === id ? null : id);
    };

    const staggerDelay = 0.1;
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * staggerDelay,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-md p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        ref={modalRef}
                        className={cn(
                            "bg-black/25 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[70vh] flex flex-col",
                            className
                        )}
                        initial="hidden"
                        animate={isModalInView ? "visible" : "hidden"}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <motion.div
                            className="flex items-center justify-between p-6 border-b border-white/10"
                            custom={0}
                            variants={fadeInVariants}
                        >
                            <div className="flex flex-col items-center text-center w-full">
                                <h2 className="text-xl font-semibold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">Transaction History</h2>
                                <p className="text-white/80 text-sm mt-1">Track your cross-chain message deliveries</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-1 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                        </motion.div>

                        {/* Transaction List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {transactions.length === 0 ? (
                                <motion.div
                                    className="flex flex-col items-center justify-center h-48 text-white/70"
                                    custom={1}
                                    variants={fadeInVariants}
                                >
                                    <ArrowRightLeft className="h-12 w-12 mb-4 opacity-50" />
                                    <p className="text-center">No transaction history found</p>
                                    <p className="text-center text-sm mt-2">Complete a cross-chain transaction to see history</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((transaction, index) => {
                                        const id = `${transaction.sourceChain}-${transaction.destinationChain}-${transaction.timestamp || index}`;
                                        const isExpanded = expandedTransaction === id;
                                        const sourceColor = chainColors[transaction.sourceChain] || '#666';
                                        const destColor = chainColors[transaction.destinationChain] || '#666';

                                        return (
                                            <motion.div
                                                key={id}
                                                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-lg"
                                                custom={index + 1}
                                                variants={fadeInVariants}
                                            >
                                                {/* Transaction Summary Row */}
                                                <div
                                                    className="flex items-center justify-between p-3 cursor-pointer group hover:bg-white/15"
                                                    onClick={() => toggleTransaction(id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                transaction.status === 'completed' && "bg-green-400 shadow-green-400/40 shadow-md",
                                                                transaction.status === 'error' && "bg-red-400 shadow-red-400/40 shadow-md",
                                                                transaction.status === 'processing' && "bg-amber-400 shadow-amber-400/40 shadow-md",
                                                                transaction.status === 'sending' && "bg-blue-400 shadow-blue-400/40 shadow-md",
                                                            )}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                                style={{ backgroundColor: sourceColor, boxShadow: `0 0 8px ${sourceColor}80` }}
                                                            >
                                                                {chainLabels[transaction.sourceChain]?.charAt(0) || '?'}
                                                            </div>
                                                            <ArrowRightLeft className="h-3 w-3 text-white/70" />
                                                            <div
                                                                className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                                style={{ backgroundColor: destColor, boxShadow: `0 0 8px ${destColor}80` }}
                                                            >
                                                                {chainLabels[transaction.destinationChain]?.charAt(0) || '?'}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-white/70">
                                                            {transaction.timestamp ? formatDate(transaction.timestamp) : "Unknown time"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={cn(
                                                                "text-xs px-2 py-1 rounded-md",
                                                                transaction.status === 'completed' && "bg-green-500/20 text-green-300 border border-green-500/30",
                                                                transaction.status === 'error' && "bg-red-500/20 text-red-300 border border-red-500/30",
                                                                transaction.status === 'processing' && "bg-amber-500/20 text-amber-300 border border-amber-500/30",
                                                                transaction.status === 'sending' && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                                                            )}
                                                        >
                                                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                        </span>
                                                        <ChevronDown
                                                            className={cn(
                                                                "h-3 w-3 text-white/70 transition-transform",
                                                                isExpanded && "transform rotate-180"
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Transaction Details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            className="border-t border-white/10 px-3 py-3 space-y-3 bg-black/30"
                                                        >
                                                            {/* Message */}
                                                            {transaction.message && (
                                                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded p-3">
                                                                    <p className="text-xs text-white/70 mb-1">Message:</p>
                                                                    <p className="text-sm text-white break-words">
                                                                        {transaction.message}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Transaction Hashes */}
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {/* Source Chain TX */}
                                                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded p-3">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full"
                                                                            style={{ backgroundColor: sourceColor, boxShadow: `0 0 6px ${sourceColor}80` }}
                                                                        />
                                                                        <p className="text-xs text-white/70">
                                                                            {chainLabels[transaction.sourceChain]} Transaction: {truncateHash(transaction.sourceChainTxHash)}
                                                                        </p>
                                                                        {transaction.sourceChainTxHash && (
                                                                            <button
                                                                                className="text-white/70 hover:text-amber-400 transition-colors ml-auto"
                                                                                aria-label="View transaction"
                                                                            >
                                                                                <ExternalLink className="h-3 w-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Destination Chain TX */}
                                                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded p-3">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full"
                                                                            style={{ backgroundColor: destColor, boxShadow: `0 0 6px ${destColor}80` }}
                                                                        />
                                                                        <p className="text-xs text-white/70">
                                                                            {chainLabels[transaction.destinationChain]} Transaction: {truncateHash(transaction.destinationChainTxHash)}
                                                                        </p>
                                                                        {transaction.destinationChainTxHash && (
                                                                            <button
                                                                                className="text-white/70 hover:text-amber-400 transition-colors ml-auto"
                                                                                aria-label="View transaction"
                                                                            >
                                                                                <ExternalLink className="h-3 w-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Error Message */}
                                                            {transaction.error && (
                                                                <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded p-3">
                                                                    <p className="text-xs text-red-300 mb-1">Error:</p>
                                                                    <p className="text-sm text-red-200 break-words">
                                                                        {transaction.error}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <motion.div
                            className="p-4 border-t border-white/10 flex justify-between items-center text-sm bg-black/20 backdrop-blur-sm"
                            custom={transactions.length + 2}
                            variants={fadeInVariants}
                        >
                            <span className="text-white/80">
                                Powered by <span className="font-medium text-white">Hermes</span> cross-chain messaging
                            </span>
                            <div className="flex gap-2">
                                {transactions.length > 0 && (
                                    <motion.div
                                        className="relative"
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {/* Subtle glow effect */}
                                        <motion.div
                                            className="absolute -inset-0.5 rounded-md z-0 opacity-50"
                                            style={{
                                                background: "linear-gradient(90deg, transparent, rgba(255, 100, 100, 0.7), transparent)",
                                                backgroundSize: "200% 100%",
                                            }}
                                            animate={{
                                                backgroundPosition: ["200% 0", "-200% 0"]
                                            }}
                                            transition={{
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleClearHistory}
                                            className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-md border border-red-300/40 text-red-300 hover:bg-red-500/20 hover:border-red-300/70 hover:text-red-200 transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(255,100,100,0.3)]"
                                        >
                                            Clear History
                                        </Button>
                                    </motion.div>
                                )}
                                <motion.div
                                    className="relative"
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {/* Subtle glow effect */}
                                    <motion.div
                                        className="absolute -inset-0.5 rounded-md z-0 opacity-50"
                                        style={{
                                            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)",
                                            backgroundSize: "200% 100%",
                                        }}
                                        animate={{
                                            backgroundPosition: ["200% 0", "-200% 0"]
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-md border border-white/40 text-white hover:bg-white/20 hover:border-white/70 hover:text-white transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
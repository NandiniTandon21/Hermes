"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TransactionState } from "@/app/dashboard/page";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<TransactionState[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load transactions from localStorage on component mount
    useEffect(() => {
        const loadTransactions = () => {
            setIsLoading(true);
            try {
                const savedTransactions = localStorage.getItem('hermesTransactions');
                if (savedTransactions) {
                    const parsedTransactions = JSON.parse(savedTransactions);
                    setTransactions(parsedTransactions);
                }
            } catch (error) {
                console.error("Failed to load transaction history:", error);
            }
            setIsLoading(false);
        };

        loadTransactions();
    }, []);

    const clearHistory = () => {
        try {
            localStorage.removeItem('hermesTransactions');
            setTransactions([]);
        } catch (error) {
            console.error("Failed to clear transaction history:", error);
        }
    };

    // Format date from timestamp
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Get status badge styling
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return "bg-green-500/20 text-green-300 border border-green-500/30";
            case 'processing':
                return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
            case 'sending':
                return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
            case 'error':
                return "bg-red-500/20 text-red-300 border border-red-500/30";
            default:
                return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col gap-8">
                    {/* Header with back button */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-black/30 text-white hover:bg-black/50 hover:text-white"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                Transaction History
                            </h1>
                        </div>
                        <Button
                            onClick={clearHistory}
                            variant="destructive"
                            className="bg-black/50 hover:bg-black/70 text-white border border-red-500/20"
                            disabled={transactions.length === 0}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear History
                        </Button>
                    </div>

                    {/* Main content */}
                    <div className="bg-black/25 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-pulse text-white">Loading history...</div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-4">
                                <p className="text-white/80 text-center">
                                    No transaction history found
                                </p>
                                <Link href="/dashboard">
                                    <Button className="bg-black/50 hover:bg-black/70 text-white border border-white/20">
                                        Create your first transaction
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {transactions.map((transaction, index) => (
                                    <motion.div
                                        key={`${transaction.timestamp || 0}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-black/40 rounded-lg p-4 border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-2 py-1 text-xs rounded-full",
                                                    getStatusBadge(transaction.status)
                                                )}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                </span>
                                                {transaction.timestamp && (
                                                    <span className="text-xs text-white/60">
                                                        {formatDate(transaction.timestamp)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="text-xs text-white/60 mb-1">From</div>
                                                <div className="text-sm text-white">
                                                    {transaction.sourceChain || 'Unknown Chain'}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-white/60 mb-1">To</div>
                                                <div className="text-sm text-white">
                                                    {transaction.destinationChain || 'Unknown Chain'}
                                                </div>
                                            </div>
                                        </div>

                                        {transaction.message && (
                                            <div className="mt-3">
                                                <div className="text-xs text-white/60 mb-1">Message</div>
                                                <div className="bg-black/50 p-2 rounded text-sm text-white border border-white/10">
                                                    <p className="whitespace-pre-wrap">{transaction.message}</p>
                                                </div>
                                            </div>
                                        )}

                                        {transaction.sourceChainTxHash && (
                                            <div className="mt-3">
                                                <div className="text-xs text-white/60 mb-1">Source Transaction</div>
                                                <div className="bg-black/50 p-2 rounded overflow-x-auto text-xs font-mono text-white/80 border border-white/10">
                                                    {transaction.sourceChainTxHash}
                                                </div>
                                            </div>
                                        )}

                                        {transaction.destinationChainTxHash && (
                                            <div className="mt-2">
                                                <div className="text-xs text-white/60 mb-1">Destination Transaction</div>
                                                <div className="bg-black/50 p-2 rounded overflow-x-auto text-xs font-mono text-white/80 border border-white/10">
                                                    {transaction.destinationChainTxHash}
                                                </div>
                                            </div>
                                        )}

                                        {transaction.error && (
                                            <div className="mt-3">
                                                <div className="text-xs text-red-300 mb-1">Error</div>
                                                <div className="bg-red-900/30 p-2 rounded text-sm text-red-300 border border-red-500/20">
                                                    {transaction.error}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

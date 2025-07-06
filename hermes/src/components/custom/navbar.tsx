"use client";

import React from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon, PlusCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface NavbarProps {
    onLogoClick: () => void;
    onStartNewTransaction: () => void;
    onShowHistory: () => void;
    isNewTransactionAllowed: boolean;
}

export const Navbar = ({ onLogoClick, onStartNewTransaction, onShowHistory, isNewTransactionAllowed }: NavbarProps) => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-4 left-4 right-4 z-40"
        >
            <div className="flex items-center justify-between bg-black/25 backdrop-blur-lg p-2 rounded-full border border-white/10 shadow-lg w-full max-w-5xl mx-auto px-4">
                <button onClick={onLogoClick} className="flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-full p-1">
                    <Image src="/logo.png" alt="Hermes Logo" width={24} height={24} className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-2">
                    {isNewTransactionAllowed && (
                        <Button
                            variant="ghost"
                            size="sm"
                            radius="full"
                            onClick={onStartNewTransaction}
                            className="text-white hover:bg-white/10 hover:text-amber-400 hover:shadow-[0_0_15px_#fbbf24] transition-all duration-300"
                        >
                            <PlusCircle className="h-4 w-4 mr-0" />
                            New Transaction
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        radius="full"
                        onClick={onShowHistory}
                        className="text-white hover:bg-white/10 hover:text-amber-400 hover:shadow-[0_0_15px_#fbbf24] transition-all duration-300"
                    >
                        <HistoryIcon className="h-4 w-4 mr-0" />
                        History
                    </Button>
                </div>
            </div>
        </motion.nav>
    );
};

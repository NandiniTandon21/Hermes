

"use client";

import React, { useRef, useState } from "react";
import { ArrowDownCircle, History as HistoryIcon } from "lucide-react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/custom/navbar";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import TransactionHistory from "@/components/custom/transaction-history";
import TransactionProgress from "@/components/custom/transaction-progress";
import {CrossChainMessageForm, TransactionState} from "@/components/custom/message-form";

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

    const [transactionState, setTransactionState] = useState<TransactionState>({
        sourceChain: '',
        destinationChain: '',
        sourceChainTxHash: null,
        destinationChainTxHash: null,
        message: null,
        status: 'idle',
        error: null
    });

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const transactionProgressRef = useRef<HTMLDivElement>(null);
    const startNewTransactionBtnRef = useRef<HTMLButtonElement>(null);

    const handleTransactionUpdate = (transaction: TransactionState) => {
        setTransactionState(transaction);

        // Scroll to transaction progress when a transaction starts on mobile devices
        if (transaction.status === 'sending' && window.innerWidth < 768 && transactionProgressRef.current) {
            setTimeout(() => {
                transactionProgressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }

        // Focus on the "Start New Transaction" button when transaction completes
        if (transaction.status === 'completed' && startNewTransactionBtnRef.current) {
            setTimeout(() => {
                startNewTransactionBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                startNewTransactionBtnRef.current?.focus();
            }, 500);
        }
    };

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = () => {
        heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formComponentRef = useRef<any>(null);

    const resetTransaction = () => {
        setTransactionState({
            sourceChain: '',
            destinationChain: '',
            sourceChainTxHash: null,
            destinationChainTxHash: null,
            message: null,
            status: 'idle',
            error: null
        });

        if (formComponentRef.current && formComponentRef.current.resetForm) {
            formComponentRef.current.resetForm();
        }
        scrollToForm();
    };

    return (
        <div className="w-full font-[family-name:var(--font-geist-sans)] overflow-x-hidden pt-16">
            <Navbar
                onLogoClick={scrollToTop}
                onStartNewTransaction={resetTransaction}
                onShowHistory={() => setIsHistoryOpen(true)}
                isNewTransactionAllowed={transactionState.status !== 'sending' && transactionState.status !== 'processing'}
            />
            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="min-h-screen w-full relative flex items-center"
            >
                {/* Split layout container */}
                <div className="flex flex-col lg:flex-row min-h-screen w-full">
                    {/* Left half */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        >
                            HERMES
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl mt-6 max-w-md text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                        >
                            Bridging chains with elegant messaging solutions
                        </motion.p>

                        {/* Scroll down button */}
                        <motion.button
                            onClick={scrollToForm}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-12 flex items-center gap-2 text-lg text-white hover:text-amber-400 transition-colors duration-300"
                        >
                            <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Get Started</span>
                            <motion.div
                                animate={{
                                    y: [0, 10, 0],
                                    boxShadow: [
                                        "0 0 10px rgba(255, 255, 255, 0.3)",
                                        "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.2)",
                                        "0 0 10px rgba(255, 255, 255, 0.3)"
                                    ]
                                }}
                                transition={{
                                    y: { repeat: Infinity, duration: 2 },
                                    boxShadow: {
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="rounded-full"
                                style={{
                                    filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
                                }}
                            >
                                <ArrowDownCircle className="h-6 w-6" />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Right half */}
                    <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative overflow-hidden">
                        <AnimatedGrid className="w-full h-full" />
                    </div>
                </div>
            </motion.section>

            {/* Form Section */}
            <section
                ref={formSectionRef}
                className="min-h-screen w-full relative flex items-center bg-transparent"
            >
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
                    {/* Left side content and transaction progress */}
                    <div className="w-full lg:w-1/2 mb-10 lg:mb-0 pr-0 lg:pr-8 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col gap-4"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl lg:text-5xl font-bold mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            >
                                Cross-Chain Communication Made Simple
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-lg mb-4 max-w-md text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                            >
                                Seamlessly connect and communicate between different blockchains
                                with our intuitive messaging platform. Hermes delivers your messages
                                securely and efficiently across the blockchain universe.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap gap-4 mb-8"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">Fast</h3>
                                        <p className="text-sm text-white/80">Quick message delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">Secure</h3>
                                        <p className="text-sm text-white/80">Cryptographically protected</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Transaction Progress */}
                        <AnimatePresence mode="wait">
                            {transactionState.status !== 'idle' && (
                                <motion.div
                                    ref={transactionProgressRef}
                                    key="transaction-progress"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="mt-4 mb-6 max-w-md"
                                >
                                    <motion.div
                                        className="relative rounded-xl p-6 overflow-hidden"
                                        style={{
                                            background: "rgba(255, 255, 255, 0.12)",
                                            backdropFilter: "blur(8px)",
                                            boxShadow: transactionState.status === 'completed'
                                                ? "0 0 25px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                                                : "0 0 20px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                                        }}
                                        animate={transactionState.status !== 'completed' ? {
                                            boxShadow: [
                                                "0 0 20px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                                                "0 0 30px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.3)",
                                                "0 0 20px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                                            ]
                                        } : undefined}
                                        transition={{
                                            duration: 2,
                                            repeat: transactionState.status !== 'completed' ? Infinity : 0,
                                            ease: "easeInOut"
                                        }}
                                    >

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-medium text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                                                    Transaction Status
                                                </span>
                                                {(transactionState.status === 'sending' || transactionState.status === 'processing') ? (
                                                    <motion.div
                                                        className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        style={{
                                                            boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
                                                        }}
                                                    >
                                                        <div className="w-1 h-1 rounded-full bg-green-500"
                                                             style={{
                                                                 boxShadow: "0 0 5px #00ff00"
                                                             }}
                                                        />
                                                        <span className="text-xs text-white uppercase tracking-wider"
                                                              style={{
                                                                  textShadow: "0 0 5px rgba(255, 255, 255, 0.8)"
                                                              }}
                                                        >
                                                            Live
                                                        </span>
                                                    </motion.div>
                                                ) : transactionState.status === 'completed' ? (
                                                    <motion.div
                                                        className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.4 }}
                                                        style={{
                                                            boxShadow: "0 0 8px rgba(74, 222, 128, 0.2)"
                                                        }}
                                                    >
                                                        <div className="w-1 h-1 rounded-full bg-green-400"
                                                             style={{
                                                                 boxShadow: "0 0 5px rgba(74, 222, 128, 0.5)"
                                                             }}
                                                        />
                                                        <span className="text-xs text-green-300 uppercase tracking-wider"
                                                              style={{
                                                                  textShadow: "0 0 5px rgba(74, 222, 128, 0.3)"
                                                              }}
                                                        >
                                                            Completed
                                                        </span>
                                                    </motion.div>
                                                ) : null}
                                            </div>
                                            <TransactionProgress
                                                sourceChain={transactionState.sourceChain}
                                                destinationChain={transactionState.destinationChain}
                                                status={transactionState.status}
                                                sourceChainTxHash={transactionState.sourceChainTxHash}
                                                destinationChainTxHash={transactionState.destinationChainTxHash}
                                                message={transactionState.message}
                                                className="w-full"
                                            />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right side form */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center">
                        <motion.div
                            ref={formRef}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/30 max-w-lg w-full"
                            style={{
                                boxShadow: "0 0 20px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                            }}
                        >
                            <CrossChainMessageForm
                                className="w-full max-w-none"
                                onTransactionUpdate={handleTransactionUpdate}
                                ref={formComponentRef}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Transaction History Modal */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <TransactionHistory
                        isOpen={isHistoryOpen}
                        onClose={() => setIsHistoryOpen(false)}
                        className="max-w-3xl"
                    />
                )}
            </AnimatePresence>

            {/* Start New Transaction Button */}
            {transactionState.status === 'completed' && (
                <div className="container mx-auto px-4 -mt-24 mb-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                    {/* Start New Transaction Button */}
                    <motion.div
                        className="relative w-full sm:w-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-lg z-0 opacity-10"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
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

                        <motion.button
                            ref={startNewTransactionBtnRef}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.02, 1],
                                boxShadow: [
                                    "0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)",
                                    "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.15)",
                                    "0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)"
                                ]
                            }}
                            transition={{
                                duration: 0.4,
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                },
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                }
                            }}
                            className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-base relative z-10 min-w-[180px] text-center"
                            onClick={resetTransaction}
                        >
                            Start New Transaction
                        </motion.button>
                    </motion.div>

                    {/* View History Button */}
                    <motion.div
                        className="relative w-full sm:w-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-lg z-0 opacity-10"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
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

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.02, 1],
                                boxShadow: [
                                    "0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)",
                                    "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.15)",
                                    "0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)"
                                ]
                            }}
                            transition={{
                                duration: 0.4,
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                },
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                }
                            }}
                            className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-base relative z-10 flex items-center justify-center gap-2 min-w-[180px]"
                            onClick={() => setIsHistoryOpen(true)}
                        >
                            <HistoryIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            View History
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* Footer */}
            <footer className="w-full py-8 flex justify-center items-center">
                <div className="text-center text-sm text-white/80">
                    Powered by <span className="font-medium text-white">Hermes</span> cross-chain messaging
                </div>
            </footer>
        </div>
    );
}

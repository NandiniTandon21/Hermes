"use client";

import React, { useRef, useState } from "react";
import { CrossChainMessageForm, TransactionState } from "@/app/dashboard/page";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";
import TransactionProgress from "@/components/custom/transaction-progress";

export default function Home() {
    // Refs for each section
    const heroRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

    // Transaction state for the progress component
    const [transactionState, setTransactionState] = useState<TransactionState>({
        sourceChain: '',
        destinationChain: '',
        sourceChainTxHash: null,
        destinationChainTxHash: null,
        message: null,
        status: 'idle',
        error: null
    });

    const handleTransactionUpdate = (transaction: TransactionState) => {
        setTransactionState(transaction);
    };

    // Scroll animation for the hero section
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Handle scroll to form section
    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Ref to access the form component for resetting
    const formComponentRef = useRef<any>(null);

    // Function to reset both transaction state and form
    const resetTransaction = () => {
        // Reset transaction state
        setTransactionState({
            sourceChain: '',
            destinationChain: '',
            sourceChainTxHash: null,
            destinationChainTxHash: null,
            message: null,
            status: 'idle',
            error: null
        });

        // Reset form if ref is available
        if (formComponentRef.current && formComponentRef.current.resetForm) {
            formComponentRef.current.resetForm();
        }
    };

    return (
        <div className="w-full font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="min-h-screen w-full relative flex items-center"
            >
                {/* Split layout container */}
                <div className="flex flex-col lg:flex-row min-h-screen w-full">
                    {/* Left half - Stylish project name */}
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
                            className="text-xl md:text-2xl mt-6 max-w-md text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
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

                    {/* Right half - Animated grid */}
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

                        {/* Transaction Progress - With smooth animation */}
                        <AnimatePresence mode="wait">
                            {transactionState.status !== 'idle' && (
                                <motion.div
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

            {/* Start New Transaction Button - with mellowed effects */}
            {transactionState.status === 'completed' && (
                <div className="container mx-auto px-4 -mt-24 mb-20 flex justify-center">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Subtle glow effect */}
                        <motion.div
                            className="absolute -inset-0.5 rounded-lg z-0 opacity-30"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
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

                        {/* Button with subtle effects */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.02, 1],
                                boxShadow: [
                                    "0 0 10px rgba(255, 255, 255, 0.1)",
                                    "0 0 15px rgba(255, 255, 255, 0.2)",
                                    "0 0 10px rgba(255, 255, 255, 0.1)"
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
                            className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-base relative z-10"
                            onClick={resetTransaction}
                        >
                            Start New Transaction
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

"use client";

import React from "react";
import {motion, useInView, Variants} from "framer-motion";

import {cn} from "@/lib/utils"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {MotionSelect} from "@/components/custom/motion-select"

export interface TransactionState {
    sourceChain: string;
    destinationChain: string;
    sourceChainTxHash: string | null;
    destinationChainTxHash: string | null;
    message: string | null;
    status: 'idle' | 'sending' | 'processing' | 'completed' | 'error';
    error: string | null;
    timestamp?: number;
}

export const CrossChainMessageForm = React.forwardRef<
    { resetForm: () => void },
    React.ComponentProps<"form"> & {
    onTransactionUpdate: (transaction: TransactionState) => void
}
>(({
       className,
       onTransactionUpdate,
       ...props
   }, ref) => {
    const [selectedSource, setSelectedSource] = React.useState<string>('')
    const [selectedDestination, setSelectedDestination] = React.useState<string>('')
    const [messageText, setMessageText] = React.useState<string>('')
    const [transaction, setTransaction] = React.useState<TransactionState>({
        sourceChain: '',
        destinationChain: '',
        sourceChainTxHash: null,
        destinationChainTxHash: null,
        message: null,
        status: 'idle',
        error: null
    })

    const resetForm = () => {
        setSelectedSource('');
        setSelectedDestination('');
        setMessageText('');
    };

    React.useImperativeHandle(ref, () => ({
        resetForm
    }));

    const updateTransaction = (newTransaction: TransactionState) => {
        setTransaction(newTransaction);
        if (onTransactionUpdate) {
            onTransactionUpdate(newTransaction);
        }
    };

    const isAllowedRoute = React.useMemo(() =>
            selectedSource === 'ethereum-sepolia' &&
            selectedDestination === 'base-sepolia',
        [selectedSource, selectedDestination]);

    React.useEffect(() => {
        if (!isAllowedRoute) {
            setMessageText('');
        }
    }, [isAllowedRoute]);

    const isFormDisabled = false;

    const isSubmitDisabled =
        !selectedSource ||
        !selectedDestination ||
        !messageText.trim() ||
        !isAllowedRoute ||
        transaction.status === 'sending' ||
        transaction.status === 'processing';

// Source chain options
    const sourceChainOptions = [
        {value: 'ethereum-sepolia', label: 'Ethereum Sepolia'},
        {value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia'},
        {value: 'optimism-sepolia', label: 'Optimism Sepolia'},
        {value: 'polygon-amoy', label: 'Polygon Amoy'},
        {value: 'base-sepolia', label: 'Base Sepolia'},
    ]

    // Destination chain options
    const destinationChainOptions = [
        {value: 'ethereum-sepolia', label: 'Ethereum Sepolia'},
        {value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia'},
        {value: 'optimism-sepolia', label: 'Optimism Sepolia'},
        {value: 'polygon-amoy', label: 'Polygon Amoy'},
        {value: 'base-sepolia', label: 'Base Sepolia'},
    ]

    const formRef = React.useRef<HTMLFormElement>(null);
    const isFormInView = useInView(formRef, {once: true, amount: 0.2});

    const staggerDelay = 0.1;
    const fadeInVariants: Variants = {
        hidden: {opacity: 0, y: 20},
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSource || !selectedDestination || !messageText.trim()) {
            const errorTransaction: TransactionState = {
                ...transaction,
                sourceChain: selectedSource,
                destinationChain: selectedDestination,
                message: messageText,
                status: 'error',
                error: 'Please fill out all fields and ensure the message is not empty.',
                timestamp: Date.now()
            };
            updateTransaction(errorTransaction);
            saveTransactionToHistory(errorTransaction);
            return;
        }

        if (selectedSource === selectedDestination) {
            const errorTransaction: TransactionState = {
                ...transaction,
                sourceChain: selectedSource,
                destinationChain: selectedDestination,
                message: messageText,
                status: 'error',
                error: 'Source and destination chains must be different',
                timestamp: Date.now()
            };
            updateTransaction(errorTransaction);
            saveTransactionToHistory(errorTransaction);
            return;
        }

        if (!isAllowedRoute) {
            const errorTransaction: TransactionState = {
                ...transaction,
                sourceChain: selectedSource,
                destinationChain: selectedDestination,
                message: messageText,
                status: 'error',
                error: 'Selected route is not allowed',
                timestamp: Date.now()
            };
            updateTransaction(errorTransaction);
            saveTransactionToHistory(errorTransaction);
            return;
        }

        try {
            const sendingTransaction: TransactionState = {
                sourceChain: selectedSource,
                destinationChain: selectedDestination,
                message: messageText,
                status: 'sending',
                error: null,
                sourceChainTxHash: null,
                destinationChainTxHash: null,
                timestamp: Date.now()
            };
            updateTransaction(sendingTransaction);

            // Simulate sending cross-chain message (this would be replaced with actual SDK calls)
            // In a real implementation, you would use Hyperlane/LayerZero/Wormhole SDK here
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful source chain transaction
            const processingTransaction: TransactionState = {
                ...sendingTransaction,
                sourceChainTxHash: `0x${Math.random().toString(16).slice(2)}`,
                status: 'processing',
            };
            updateTransaction(processingTransaction);

            // Simulate processing time for cross-chain message
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock successful destination chain transaction
            const completedTransaction: TransactionState = {
                ...processingTransaction,
                destinationChainTxHash: `0x${Math.random().toString(16).slice(2)}`,
                status: 'completed',
            };
            updateTransaction(completedTransaction);

            // Save completed transaction to history
            saveTransactionToHistory(completedTransaction);

        } catch (error) {
            const errorTransaction: TransactionState = {
                ...transaction,
                sourceChain: selectedSource,
                destinationChain: selectedDestination,
                message: messageText,
                status: 'error',
                error: error instanceof Error ? error.message : 'An unknown error occurred',
                timestamp: Date.now()
            };
            updateTransaction(errorTransaction);
            saveTransactionToHistory(errorTransaction);
        }
    };

    // Function to save transaction to localStorage
    const saveTransactionToHistory = (transaction: TransactionState) => {
        if (typeof window === 'undefined') return; // Skip on server-side rendering

        try {
            // Only save transactions that have status other than 'idle'
            if (transaction.status === 'idle') return;

            // Get existing transactions from localStorage
            const existingTransactionsJson = localStorage.getItem('hermesTransactions');
            let existingTransactions: TransactionState[] = [];

            if (existingTransactionsJson) {
                existingTransactions = JSON.parse(existingTransactionsJson);
            }

            // Add new transaction to the beginning of the array (most recent first)
            existingTransactions.unshift(transaction);

            // Limit the number of transactions stored to prevent localStorage overflow
            const maxHistorySize = 20;
            if (existingTransactions.length > maxHistorySize) {
                existingTransactions = existingTransactions.slice(0, maxHistorySize);
            }

            // Save back to localStorage
            localStorage.setItem('hermesTransactions', JSON.stringify(existingTransactions));

        } catch (error) {
            console.error("Failed to save transaction to history:", error);
        }
    };

    const getPlaceholder = () => {
        if (!selectedSource || !selectedDestination) {
            return "Please select source and destination chains";
        }
        if (!isAllowedRoute) {
            return "Route not yet supported";
        }
        return "Type your message here";
    };

    return (
        <motion.form
            ref={formRef}
            className={cn("max-w-md mx-auto flex flex-col gap-6 bg-black/25 backdrop-blur-lg p-8 rounded-xl border border-white/10 shadow-lg text-white", className)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            onSubmit={handleSubmit}
        >
            {/* Header */}
            <motion.div
                className="flex flex-col items-center gap-2 text-center"
                custom={0}
                variants={fadeInVariants}
            >
                <h1 className="text-2xl font-bold text-white drop-shadow-glow">Explore Interoperability</h1>
                <p className="text-white/80 text-sm text-balance">
                    Choose your chains. Compose your message.<br/>
                    Watch it fly across blockchains.
                </p>
            </motion.div>

            {/* Form fields */}
            <div
                className={cn("grid gap-6", (transaction.status === 'sending' || transaction.status === 'processing') && "opacity-70")}>
                {/* Source */}
                <motion.div
                    className="grid gap-3"
                    custom={1}
                    variants={fadeInVariants}
                >
                    <div>
                        <MotionSelect
                            label="Source Chain"
                            value={selectedSource}
                            onChange={(value) => setSelectedSource(value)}
                            options={sourceChainOptions}
                            disabled={isFormDisabled}
                            className="text-white bg-black/50"
                        />
                    </div>
                </motion.div>

                {/* Destination */}
                <motion.div
                    className="grid gap-3"
                    custom={2}
                    variants={fadeInVariants}
                >
                    <MotionSelect
                        label="Destination Chain"
                        value={selectedDestination}
                        onChange={(value) => setSelectedDestination(value)}
                        options={destinationChainOptions}
                        disabled={isFormDisabled}
                        className="text-white bg-black/50"
                    />
                </motion.div>

                {/* Message */}
                <motion.div
                    className="grid gap-3"
                    custom={3}
                    variants={fadeInVariants}
                >
                    <div className="flex items-center">
                        <Label htmlFor="message" className="text-white">Message</Label>
                    </div>
                    <Input
                        id="message"
                        multiline={true}
                        rows={3}
                        placeholder={getPlaceholder()}
                        required
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={!isAllowedRoute || isFormDisabled}
                        className="text-white placeholder:text-white/50 bg-black/50 border-white/20 focus:ring-2 focus:ring-amber-400/30"
                    />
                </motion.div>

                {/* Send/submit */}
                <motion.div
                    className="flex justify-center"
                    custom={4}
                    variants={fadeInVariants}
                >
                    <Button
                        type="submit"
                        variant="slide"
                        radius="md"
                        name1={
                            transaction.status === 'sending' ? 'Sending...' :
                                transaction.status === 'processing' ? 'Processing...' :
                                    'Send Message'
                        }
                        name2={"Deliver via Hermes"}
                        className="max-w-lg hover:from-amber-400 hover:via-yellow-500 hover:to-orange-500 hover:shadow-amber-500/40 hover:shadow-2xl hover:ring-2 hover:ring-amber-400/50 transition-all duration-700 text-white"
                        disabled={isSubmitDisabled}
                    />
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                className="text-center text-sm"
                custom={5}
                variants={fadeInVariants}
            >
                Powered by <span className="font-medium">Hermes</span> cross-chain messaging
            </motion.div>
        </motion.form>
    )
})

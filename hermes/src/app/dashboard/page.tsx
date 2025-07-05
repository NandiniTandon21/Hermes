"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils"
import { toast } from 'sonner';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MotionSelect } from "@/components/custom/motion-select"
import { X } from "lucide-react"; // Import X icon for dismiss button

// Added interfaces for transaction data and message state
interface TransactionState {
    sourceChainTxHash: string | null;
    destinationChainTxHash: string | null;
    message: string | null;
    status: 'idle' | 'sending' | 'processing' | 'completed' | 'error';
    error: string | null;
}

export function CrossChainMessageForm({
                                          className,
                                          ...props
                                      }: React.ComponentProps<"form">) {
    const [selectedSource, setSelectedSource] = React.useState<string>('')
    const [selectedDestination, setSelectedDestination] = React.useState<string>('')
    const [messageText, setMessageText] = React.useState<string>('')
    const [transaction, setTransaction] = React.useState<TransactionState>({
        sourceChainTxHash: null,
        destinationChainTxHash: null,
        message: null,
        status: 'idle',
        error: null
    })

    // Check if the selected route is allowed (Ethereum Sepolia to Base Sepolia)
    const isAllowedRoute = React.useMemo(() =>
        selectedSource === 'ethereum-sepolia' &&
        selectedDestination === 'base-sepolia',
    [selectedSource, selectedDestination]);

    // Reset message text when route changes to/from allowed state
    React.useEffect(() => {
        if (!isAllowedRoute) {
            // Clear the message when a non-allowed route is selected
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


    // Handle dismissing the message delivered card and resetting the form
    const handleDismissMessageCard = () => {
        setSelectedSource('');
        setSelectedDestination('');
        setMessageText('');
        setTransaction({
            sourceChainTxHash: null,
            destinationChainTxHash: null,
            message: null,
            status: 'idle',
            error: null
        });
    };

    // Source chain options - all selectable
    const sourceChainOptions = [
        { value: 'ethereum-sepolia', label: 'Ethereum Sepolia' },
        { value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia' },
        { value: 'optimism-sepolia', label: 'Optimism Sepolia' },
        { value: 'polygon-amoy', label: 'Polygon Amoy' },
        { value: 'base-sepolia', label: 'Base Sepolia' },
    ]

    // Destination chain options - all selectable
    const destinationChainOptions = [
        { value: 'ethereum-sepolia', label: 'Ethereum Sepolia' },
        { value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia' },
        { value: 'optimism-sepolia', label: 'Optimism Sepolia' },
        { value: 'polygon-amoy', label: 'Polygon Amoy' },
        { value: 'base-sepolia', label: 'Base Sepolia' },
    ]

    const formRef = React.useRef<HTMLFormElement>(null);
    const isFormInView = useInView(formRef, { once: true, amount: 0.2 });

    const staggerDelay = 0.1;
    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * staggerDelay,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] // Use array, not string
            }
        })
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!selectedSource || !selectedDestination || !messageText.trim()) {
            setTransaction({
                ...transaction,
                status: 'error',
                error: 'Please fill out all fields and ensure the message is not empty.'
            });
            return;
        }

        if (selectedSource === selectedDestination) {
            setTransaction({
                ...transaction,
                status: 'error',
                error: 'Source and destination chains must be different'
            });
            return;
        }

        // Check if the selected route is allowed
        if (!isAllowedRoute) {
            setTransaction({
                ...transaction,
                status: 'error',
                error: 'Selected route is not allowed'
            });
            return;
        }

        try {
            // Update state to indicate sending
            setTransaction({
                ...transaction,
                status: 'sending',
                error: null
            });

            // Simulate sending cross-chain message (this would be replaced with actual SDK calls)
            // In a real implementation, you would use Hyperlane/LayerZero/Wormhole SDK here
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful source chain transaction
            setTransaction({
                ...transaction,
                sourceChainTxHash: `0x${Math.random().toString(16).slice(2)}`,
                status: 'processing',
                message: messageText // Store the message during processing
            });

            // Simulate processing time for cross-chain message
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock successful destination chain transaction
            setTransaction({
                sourceChainTxHash: transaction.sourceChainTxHash,
                destinationChainTxHash: `0x${Math.random().toString(16).slice(2)}`,
                message: messageText,
                status: 'completed',
                error: null
            });

        } catch (error) {
            setTransaction({
                ...transaction,
                status: 'error',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
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
            className={cn("max-w-md mx-auto flex flex-col gap-6", className)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            onSubmit={handleSubmit}
            {...props}
        >
            {/* Header */}
            <motion.div
                className="flex flex-col items-center gap-2 text-center"
                custom={0}
                variants={fadeInVariants}
            >
                <h1 className="text-2xl font-bold">Explore Interoperability</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Choose your chains. Compose your message.<br/>
                    Watch it fly across blockchains.
                </p>
            </motion.div>

            {/* Form fields */}
            <div className={cn("grid gap-6", (transaction.status === 'sending' || transaction.status === 'processing') && "opacity-70")}>
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
                    />
                </motion.div>

                {/* Message */}
                <motion.div
                    className="grid gap-3"
                    custom={3}
                    variants={fadeInVariants}
                >
                    <div className="flex items-center">
                        <Label htmlFor="message">Message</Label>
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
                        className="max-w-lg hover:from-amber-400 hover:via-yellow-500 hover:to-orange-500 hover:shadow-amber-500/40 hover:shadow-2xl hover:ring-2 hover:ring-amber-400/50 transition-all duration-700"
                        disabled={isSubmitDisabled}
                    />
                </motion.div>
            </div>

            {/* Transaction Status */}
            {(transaction.status !== 'idle') && (
                <motion.div
                    className="mt-4 p-4 rounded-lg border bg-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium">
                            {transaction.status === 'sending' && 'Sending Message...'}
                            {transaction.status === 'processing' && 'Processing Cross-Chain Transfer...'}
                            {transaction.status === 'completed' && 'Message Delivered!'}
                            {transaction.status === 'error' && 'Error'}
                        </h3>

                        {/* Only show dismiss button when message is delivered (completed) */}
                        {transaction.status === 'completed' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full"
                                onClick={handleDismissMessageCard}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Dismiss</span>
                            </Button>
                        )}
                    </div>

                    {transaction.error && (
                        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm">
                            {transaction.error}
                        </div>
                    )}

                    {/* Transaction Details Section */}
                    <div className="space-y-3 border-t pt-3 mt-3">
                        {/* Source Chain Transaction - Always show during processing/completed */}
                        {transaction.sourceChainTxHash && (
                            <div className="mb-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">Source Chain Transaction:</p>
                                    {transaction.status === 'sending' && (
                                        <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Pending</span>
                                    )}
                                    {(transaction.status === 'processing' || transaction.status === 'completed') && (
                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Confirmed</span>
                                    )}
                                </div>
                                <p className="text-xs font-mono bg-muted p-2 mt-1 rounded overflow-x-auto">
                                    {transaction.sourceChainTxHash}
                                </p>
                            </div>
                        )}

                        {/* Destination Chain Transaction - Show during completed */}
                        {transaction.destinationChainTxHash && (
                            <div className="mb-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">Destination Chain Transaction:</p>
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Confirmed</span>
                                </div>
                                <p className="text-xs font-mono bg-muted p-2 mt-1 rounded overflow-x-auto">
                                    {transaction.destinationChainTxHash}
                                </p>
                            </div>
                        )}

                        {/* Message - Show during all phases */}
                        {transaction.message && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">Message Content:</p>
                                    {transaction.status === 'sending' && (
                                        <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">Sending</span>
                                    )}
                                    {transaction.status === 'processing' && (
                                        <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">In Transit</span>
                                    )}
                                    {transaction.status === 'completed' && (
                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Delivered</span>
                                    )}
                                </div>
                                <div className="bg-muted p-2 mt-1 rounded text-sm">
                                    <p className="whitespace-pre-wrap">{transaction.message}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Replaced auto-reset notification with Done button for completed transactions */}
                    {transaction.status === 'completed' && (
                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleDismissMessageCard}
                            >
                                Done - Start New Transaction
                            </Button>
                        </div>
                    )}
                </motion.div>
            )}

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
}

export default function DashboardPage() {
    return (
        <div className="container py-10">
            <CrossChainMessageForm />
        </div>
    )
}

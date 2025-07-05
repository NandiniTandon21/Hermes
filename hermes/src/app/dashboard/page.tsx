"use client";

import React, { useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MotionSelect } from "@/components/custom/motion-select"

export function CrossChainMessageForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [selectedSource, setSelectedSource] = React.useState<string>('')
    const [selectedDestination, setSelectedDestination] = React.useState<string>('')
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

    return (
        <motion.form
            ref={formRef}
            className={cn("flex flex-col gap-6", className)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            {...props} // Use restProps instead of props
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
            <div className="grid gap-6">
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
                        onChange={(e) => {
                            const value = typeof e === 'string' ? e : e.target.value
                            setSelectedSource(value)
                        }}
                        options={[
                            { value: 'ethereum-sepolia', label: 'Ethereum Sepolia' },
                            { value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia' },
                            { value: 'optimism-sepolia', label: 'Optimism Sepolia' },
                            { value: 'polygon-amoy', label: 'Polygon Amoy' },
                            { value: 'base-sepolia', label: 'Base Sepolia' },
                            { value: 'bnb-testnet', label: 'BNB Smart Chain Testnet' },
                            { value: 'avalanche-fuji', label: 'Avalanche Fuji' },
                            { value: 'fantom-testnet', label: 'Fantom Testnet' },
                            { value: 'moonbase-alpha', label: 'Moonbase Alpha' },
                            { value: 'linea-sepolia', label: 'Linea Sepolia' },
                            { value: 'scroll-sepolia', label: 'Scroll Sepolia' },
                            { value: 'mantle-testnet', label: 'Mantle Testnet' },
                            { value: 'gnosis-chiado', label: 'Gnosis Chiado' },
                            { value: 'mode-sepolia', label: 'Mode Sepolia' },
                            { value: 'zksync-sepolia', label: 'zkSync Sepolia' },
                            { value: 'solana-devnet', label: 'Solana Devnet' },
                            { value: 'aptos-testnet', label: 'Aptos Testnet' },
                            { value: 'sui-testnet', label: 'Sui Testnet' },
                            { value: 'axelar-testnet', label: 'Axelar Testnet' },
                            { value: 'osmosis-testnet', label: 'Osmosis Testnet' },
                            { value: 'evmos-testnet', label: 'Evmos Testnet' },
                        ]}
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
                        options={[
                            { value: 'ethereum-sepolia', label: 'Ethereum Sepolia' },
                            { value: 'arbitrum-sepolia', label: 'Arbitrum Sepolia' },
                            { value: 'optimism-sepolia', label: 'Optimism Sepolia' },
                            { value: 'polygon-amoy', label: 'Polygon Amoy' },
                            { value: 'base-sepolia', label: 'Base Sepolia' },
                            { value: 'bnb-testnet', label: 'BNB Smart Chain Testnet' },
                            { value: 'avalanche-fuji', label: 'Avalanche Fuji' },
                            { value: 'fantom-testnet', label: 'Fantom Testnet' },
                            { value: 'moonbase-alpha', label: 'Moonbase Alpha' },
                            { value: 'linea-sepolia', label: 'Linea Sepolia' },
                            { value: 'scroll-sepolia', label: 'Scroll Sepolia' },
                            { value: 'mantle-testnet', label: 'Mantle Testnet' },
                            { value: 'gnosis-chiado', label: 'Gnosis Chiado' },
                            { value: 'mode-sepolia', label: 'Mode Sepolia' },
                            { value: 'zksync-sepolia', label: 'zkSync Sepolia' },
                            { value: 'solana-devnet', label: 'Solana Devnet' },
                            { value: 'aptos-testnet', label: 'Aptos Testnet' },
                            { value: 'sui-testnet', label: 'Sui Testnet' },
                            { value: 'axelar-testnet', label: 'Axelar Testnet' },
                            { value: 'osmosis-testnet', label: 'Osmosis Testnet' },
                            { value: 'evmos-testnet', label: 'Evmos Testnet' },
                        ]}
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
                        placeholder="Type your message here (Shift+Enter for new line)"
                        required
                    />
                </motion.div>

                {/* Send/submit */}
                <motion.div
                    custom={4}
                    variants={fadeInVariants}
                >
                    <Button
                        type="submit"
                        variant="slide"
                        radius="md"
                        name1="Send Message"
                        name2="Deliver via Hermes"
                        className="w-full hover:from-amber-400 hover:via-yellow-500 hover:to-orange-500 hover:shadow-amber-500/40 hover:shadow-2xl hover:ring-2 hover:ring-amber-400/50 transition-all duration-700"
                    />
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                className="text-center text-sm"
                custom={5}
                variants={fadeInVariants}
            >
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                    Sign up
                </a>
            </motion.div>
        </motion.form>
    )
}

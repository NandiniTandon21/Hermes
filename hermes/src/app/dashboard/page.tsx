"use client";

import React from "react";
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/custom/select"

export function CrossChainMessageForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [selectedSource, setSelectedSource] = React.useState<string>('')
    const [selectedDestination, setSelectedDestination] = React.useState<string>('')
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                {/* Source */}
                <div className="grid gap-3">
                    <Select
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

                {/* Destination */}
                <div className="grid gap-3">
                    <Select
                    label="Destination Chain"
                    value={selectedDestination}
                    onChange={(e) => {
                        const value = typeof e === 'string' ? e : e.target.value
                        setSelectedDestination(value)
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

                {/* Message */}
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="message">Message</Label>
                    </div>
                    <Input
                        id="message"
                        multiline={true}
                        rows={4}
                        placeholder="Type your message here (Shift+Enter for new line)"
                        required
                    />
                </div>

                {/* Send/submit */}
                <Button
                    type="submit"
                    variant="slide"
                    radius="md"
                    name1="Send Message"
                    name2="Deliver via Hermes"
                    className="hover:from-amber-400 hover:via-yellow-500 hover:to-orange-500 hover:shadow-amber-500/40 hover:shadow-2xl hover:ring-2 hover:ring-amber-400/50 transition-all duration-700"
                />
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                    Sign up
                </a>
            </div>
        </form>
    )
}

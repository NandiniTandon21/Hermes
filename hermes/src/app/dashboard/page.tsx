import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function CrossChainMessageForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
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
                    <Label htmlFor="sourceChain">Source Chain</Label>
                    <Select defaultValue="" searchable>
                        <SelectTrigger id="sourceChain" size="default">
                            <SelectValue placeholder="Select a source" />
                        </SelectTrigger>
                        <SelectContent size="xl">
                            <SelectItem size="lg" value="blockchain">Blockchain</SelectItem>
                            <SelectItem size="lg" value="deFi">DeFi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Destination */}
                <div className="grid gap-3">
                    <Label htmlFor="destinationChain">Destination Chain</Label>
                    <Select defaultValue="" searchable>
                        <SelectTrigger id="destinationChain" size="default">
                            <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent size="xl">
                            <SelectGroup>
                                <SelectItem size="lg" value="ethereum-sepolia">Ethereum Sepolia</SelectItem>
                                <SelectItem size="lg" value="arbitrum-sepolia">Arbitrum Sepolia</SelectItem>
                                <SelectItem size="lg" value="optimism-sepolia">Optimism Sepolia</SelectItem>
                                <SelectItem size="lg" value="polygon-amoy">Polygon Amoy</SelectItem>
                                <SelectItem size="lg" value="base-sepolia">Base Sepolia</SelectItem>
                                <SelectItem size="lg" value="bnb-testnet">BNB Smart Chain Testnet</SelectItem>
                                <SelectItem size="lg" value="avalanche-fuji">Avalanche Fuji</SelectItem>
                                <SelectItem size="lg" value="fantom-testnet">Fantom Testnet</SelectItem>
                                <SelectItem size="lg" value="moonbase-alpha">Moonbase Alpha</SelectItem>
                                <SelectItem size="lg" value="linea-sepolia">Linea Sepolia</SelectItem>
                                <SelectItem size="lg" value="scroll-sepolia">Scroll Sepolia</SelectItem>
                                <SelectItem size="lg" value="mantle-testnet">Mantle Testnet</SelectItem>
                                <SelectItem size="lg" value="gnosis-chiado">Gnosis Chiado</SelectItem>
                                <SelectItem size="lg" value="mode-sepolia">Mode Sepolia</SelectItem>
                                <SelectItem size="lg" value="zksync-sepolia">zkSync Sepolia</SelectItem>
                                <SelectItem size="lg" value="solana-devnet">Solana Devnet</SelectItem>
                                <SelectItem size="lg" value="aptos-testnet">Aptos Testnet</SelectItem>
                                <SelectItem size="lg" value="sui-testnet">Sui Testnet</SelectItem>
                                <SelectItem size="lg" value="axelar-testnet">Axelar Testnet</SelectItem>
                                <SelectItem size="lg" value="osmosis-testnet">Osmosis Testnet</SelectItem>
                                <SelectItem size="lg" value="evmos-testnet">Evmos Testnet</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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

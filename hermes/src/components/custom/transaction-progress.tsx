import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TransactionProgressProps {
    sourceChain: string;
    destinationChain: string;
    status: 'idle' | 'sending' | 'processing' | 'completed' | 'error';
    sourceChainTxHash?: string | null;
    destinationChainTxHash?: string | null;
    message?: string | null;
    className?: string;
}

const chainLabels: Record<string, string> = {
    'ethereum-sepolia': 'ETH',
    'arbitrum-sepolia': 'ARB',
    'optimism-sepolia': 'OP',
    'polygon-amoy': 'POL',
    'base-sepolia': 'BASE',
};

const chainColors: Record<string, string> = {
    'ethereum-sepolia': '#627EEA',
    'arbitrum-sepolia': '#28A0F0',
    'optimism-sepolia': '#FF0420',
    'polygon-amoy': '#8247E5',
    'base-sepolia': '#0052FF',
};

export default function TransactionProgress({
                                                sourceChain = 'ethereum-sepolia',
                                                destinationChain = 'arbitrum-sepolia',
                                                status = 'processing',
                                                sourceChainTxHash = '0x1234567890abcdef1234567890abcdef12345678',
                                                destinationChainTxHash = null,
                                                message = 'Processing through relay network...',
                                                className = ''
                                            }: TransactionProgressProps) {
    const [pollingActive, setPollingActive] = useState(false);

    useEffect(() => {
        if (status === 'sending' || status === 'processing') {
            setPollingActive(true);
        } else {
            setPollingActive(false);
        }
    }, [status]);

    const sourceColor = chainColors[sourceChain] || '#666';
    const destColor = chainColors[destinationChain] || '#666';

    const steps = [
        {
            id: 'source',
            label: chainLabels[sourceChain],
            active: status !== 'idle',
            completed: status !== 'idle',
            color: sourceColor
        },
        {
            id: 'relay',
            label: 'RELAY',
            active: status === 'processing' || status === 'completed',
            completed: status === 'completed',
            color: '#FFD700'
        },
        {
            id: 'destination',
            label: chainLabels[destinationChain],
            active: status === 'completed',
            completed: status === 'completed',
            color: destColor
        }
    ];

    return (
        <div className={`max-w-md mx-auto rounded-xl bg-black/90 p-4 ${className}`}>
            {/* Progress Line */}
            <div className="relative mb-6">
                {/* Background Line - Gray Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-500/50 rounded-full" />

                {/* Progress Line - Solid Glowy White Line */}
                <motion.div
                    className="absolute top-4 left-0 h-0.5 bg-white rounded-full"
                    style={{
                        boxShadow: "0 0 6px #fff, 0 0 12px rgba(255,255,255,0.8)"
                    }}
                    initial={{ width: "0%" }}
                    animate={{
                        width: status === 'sending' ? "50%" :
                            status === 'processing' ? "75%" :
                                status === 'completed' ? "99%" : "0%"
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center">
                            {/* Step Circle */}
                            <motion.div
                                className={`w-6 h-6 rounded-full border flex items-center justify-center backdrop-blur-sm ${
                                    step.completed
                                        ? 'bg-green-500 border-green-400'
                                        : step.active
                                            ? 'bg-white/10 border-white'
                                            : 'bg-white/5 border-white/30'
                                }`}
                                animate={{
                                    scale: step.completed ? 1.1 : step.active ? 1.05 : 1,
                                    boxShadow: step.completed
                                        ? "0 0 10px #4ade80, 0 0 20px rgba(74, 222, 128, 0.8)"
                                        : step.active
                                            ? "0 0 10px #fff, 0 0 15px rgba(255, 255, 255, 0.7)"
                                            : "0 0 5px rgba(255, 255, 255, 0.1)"
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        step.completed ? 'bg-white' : 
                                        step.active ? 'bg-white' : 'bg-white/40'
                                    }`}
                                    style={{
                                        boxShadow: step.active || step.completed ?
                                            "0 0 6px #fff, 0 0 10px rgba(255, 255, 255, 0.7)" :
                                            "none"
                                    }}
                                />
                            </motion.div>

                            {/* Step Label */}
                            <div className="mt-2 text-center">
                                <p className={`text-xs font-medium ${
                                    step.active ? 'text-white' : 'text-white/60'
                                }`}
                                   style={{
                                      textShadow: step.active ? "0 0 5px rgba(255, 255, 255, 0.9)" : "none"
                                   }}
                                >
                                    {step.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Details Section */}
            <div className="space-y-3 max-w-xl mx-auto text-xs">

                {/* Transaction Hashes */}
                <div className="grid grid-cols-1 gap-3">
                    {/* Source Transaction */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                         style={{
                             boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)"
                         }}
                    >
                        <div className="flex items-start gap-2">
                            <div className="mt-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        boxShadow: "0 0 3px #ffffff"
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-1">
                                    <p className="text-white text-xs font-medium"
                                      style={{
                                          textShadow: "0 0 4px rgba(255, 255, 255, 0.8)"
                                      }}
                                    >
                                        {chainLabels[sourceChain]} Transaction ID:
                                    </p>
                                    {sourceChainTxHash ? (
                                        <p className="text-white/80 font-mono text-xs truncate max-w-[180px]"
                                          style={{
                                              textShadow: "0 0 3px rgba(255, 255, 255, 0.5)"
                                          }}
                                        >
                                            {sourceChainTxHash}
                                        </p>
                                    ) : (
                                        <p className="text-white/40 text-xs">Pending...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destination Transaction */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                         style={{
                             boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)"
                         }}
                    >
                        <div className="flex items-start gap-2">
                            <div className="mt-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        boxShadow: "0 0 3px #ffffff"
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-1">
                                    <p className="text-white text-xs font-medium"
                                      style={{
                                          textShadow: "0 0 4px rgba(255, 255, 255, 0.8)"
                                      }}
                                    >
                                        {chainLabels[destinationChain]} Transaction ID:
                                    </p>
                                    {destinationChainTxHash ? (
                                        <p className="text-white/80 font-mono text-xs truncate max-w-[180px]"
                                          style={{
                                              textShadow: "0 0 3px rgba(255, 255, 255, 0.5)"
                                          }}
                                        >
                                            {destinationChainTxHash}
                                        </p>
                                    ) : (
                                        <p className="text-white/40 text-xs">Pending...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {message && (
                    <div className="bg-white/5 border border-white/20 rounded-lg p-3"
                         style={{
                             boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)"
                         }}
                    >
                        <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-white"
                                     style={{
                                         boxShadow: "0 0 3px #ffffff"
                                     }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-1">
                                    <p className="text-white/80 font-mono text-xs truncate max-w-[180px]"
                                       style={{
                                           textShadow: "0 0 3px rgba(255, 255, 255, 0.5)"
                                       }}
                                    >
                                        Content:
                                    </p>
                                    <p className="text-white text-xs"
                                       style={{
                                           textShadow: "0 0 5px rgba(255, 255, 255, 0.8)"
                                       }}
                                    >
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
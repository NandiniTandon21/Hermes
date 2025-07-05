"use client";

import React, { useRef, useEffect } from "react";
import { CrossChainMessageForm } from "@/app/dashboard/page";
import ThemeSwitcher from "@/components/themeSwitcher";
import { AnimatedGrid } from "@/components/ui/animatedGrid";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";

export default function Home() {
    // Refs for each section
    const heroRef = useRef<HTMLDivElement>(null);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

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
                    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16 relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        >
                            HERMES
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl mt-6 max-w-md text-center lg:text-left"
                        >
                            Bridging chains with elegant messaging solutions
                        </motion.p>

                        {/* Scroll down button */}
                        <motion.button
                            onClick={scrollToForm}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-12 flex items-center gap-2 text-lg hover:text-primary transition-colors duration-300"
                        >
                            <span>Get Started</span>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
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
                className="min-h-screen w-full relative flex items-center bg-gradient-to-b from-background to-background/80 dark:from-background/80 dark:to-background"
            >
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
                    {/* Left side content */}
                    <div className="w-full lg:w-1/2 mb-10 lg:mb-0 pr-0 lg:pr-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Cross-Chain Communication Made Simple
                            </h2>
                            <p className="text-lg mb-8 max-w-md">
                                Seamlessly connect and communicate between different blockchains
                                with our intuitive messaging platform. Hermes delivers your messages
                                securely and efficiently across the blockchain universe.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Fast</h3>
                                        <p className="text-sm text-muted-foreground">Quick message delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Secure</h3>
                                        <p className="text-sm text-muted-foreground">Cryptographically protected</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side form */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            ref={formRef}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border"
                        >
                            <CrossChainMessageForm />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Theme switcher */}
            <ThemeSwitcher
                currentTheme="dark"
                className="fixed top-4 right-4 z-20"
            />
        </div>
    );
}

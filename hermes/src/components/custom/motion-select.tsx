"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";

export interface MotionSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface MotionSelectProps {
    options: MotionSelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
}

export const MotionSelect = React.forwardRef<HTMLDivElement, MotionSelectProps>(
    ({
         options,
         value,
         onChange,
         placeholder = "Select an option",
         className,
         containerClassName,
         label,
         error,
         disabled,
         searchable = true
     }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [selectedValue, setSelectedValue] = React.useState(value || "");
        const [searchQuery, setSearchQuery] = React.useState("");

        const containerRef = React.useRef<HTMLDivElement>(null);
        const searchInputRef = React.useRef<HTMLInputElement>(null);

        // Update internal state when external value changes
        React.useEffect(() => {
            if (value !== undefined) {
                setSelectedValue(value);
            }
        }, [value]);

        // Close dropdown when clicking outside
        React.useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target as Node)
                ) {
                    setIsOpen(false);
                    setSearchQuery("");
                }
            };

            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isOpen]);

        // Focus search input when dropdown opens
        React.useEffect(() => {
            if (isOpen && searchable && searchInputRef.current) {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 10);
            }
        }, [isOpen, searchable]);

        const selectedOption = options.find(option => option.value === selectedValue);

        const filteredOptions = React.useMemo(() => {
            if (!searchQuery) return options;

            return options.filter(option =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }, [options, searchQuery]);

        const handleSelect = (option: MotionSelectOption) => {
            if (option.disabled) return;

            setSelectedValue(option.value);
            setIsOpen(false);
            setSearchQuery("");

            if (onChange) {
                onChange(option.value);
            }
        };

        return (
            <div
                className={cn("relative w-full", containerClassName)}
                ref={containerRef}
            >
                {label && (
                    <motion.label
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </motion.label>
                )}

                <motion.div
                    className="relative w-full"
                    ref={ref}
                >
                    <motion.button
                        type="button"
                        className={cn(
                            "flex items-center justify-between w-full px-3.5 py-2.5 text-sm rounded-lg border border-input bg-background text-foreground",
                            "transition-all duration-200 outline-none",
                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
                            error ? "border-destructive" : "",
                            className
                        )}
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ y: -10, scaleY: 0.8 }}
                                animate={{ y: 0, scaleY: 1 }}
                                exit={{ y: -10, scaleY: 0.8 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                style={{ originY: "top" }}
                                className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-xl max-h-60 overflow-hidden"
                            >
                                <div className="overflow-auto max-h-60">
                                    {searchable && (
                                        <div className="sticky top-0 px-2 py-1.5 border-b border-border bg-popover">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                                <motion.input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    className="w-full py-2 pl-8 pr-3 text-sm rounded-md bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="py-1">
                                        {filteredOptions.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                                                No options found
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                {filteredOptions.map((option, index) => (
                                                    <motion.div
                                                        key={option.value}
                                                        initial={{ x: -10 }}
                                                        animate={{ x: 0 }}
                                                        exit={{ x: -10 }}
                                                        transition={{ delay: index * 0.03, duration: 0.15 }}
                                                        className={cn(
                                                            "px-3 py-2 text-sm flex items-center justify-between transition-colors duration-150",
                                                            option.disabled
                                                                ? "cursor-not-allowed hover:bg-accent/50 hover:text-accent-foreground/80" // Allow hover but with reduced opacity
                                                                : "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                                            option.value === selectedValue
                                                                ? "bg-accent text-accent-foreground font-medium"
                                                                : ""
                                                        )}
                                                        onClick={() => handleSelect(option)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                            <span className="flex-1 truncate select-none">
                              {option.label}
                            </span>
                                                        {option.value === selectedValue && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="ml-2 flex-shrink-0"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-destructive"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);

MotionSelect.displayName = "MotionSelect";
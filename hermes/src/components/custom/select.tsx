"use client";

import React from 'react';
import { createPortal } from 'react-dom';

import {cn} from "@/lib/utils";

export interface SelectProps {
    error?: string;
    label?: string;
    containerClassName?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    loading?: boolean;
    value?: string;
    onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    name?: string;
    style?: React.CSSProperties;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    ({
         className,
         error,
         label,
         containerClassName,
         options,
         loading,
         value,
         onChange,
         placeholder = "Select an option",
         disabled,
         name,
         style,
         ...props
     }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const [selectedValue, setSelectedValue] = React.useState(value || "");
        const dropdownRef = React.useRef<HTMLDivElement>(null);
        const triggerRef = React.useRef<HTMLDivElement>(null);
        const [dropdownPosition, setDropdownPosition] = React.useState({
            top: 0,
            left: 0,
            width: 0,
            placement: 'bottom'
        });

        const filteredOptions = options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const selectedOption = options.find(opt => opt.value === selectedValue);

        React.useEffect(() => {
            setSelectedValue(value || "");
        }, [value]);

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                    triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Initial positioning when dropdown is opened
        React.useEffect(() => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const dropdownHeight = 320; // Approximate max height of dropdown (60px per option x ~5 options + search)
                const windowHeight = window.innerHeight;
                const spaceBelow = windowHeight - rect.bottom;

                // Check if enough space below
                const placement = spaceBelow < dropdownHeight ? 'top' : 'bottom';

                // Initial positioning using estimated height
                setDropdownPosition({
                    top: placement === 'top'
                        ? rect.top + window.scrollY - dropdownHeight
                        : rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    placement
                });
            }
        }, [isOpen]);

        // Update position when dropdown is first rendered or changes size
        const updateDropdownPosition = React.useCallback(() => {
            if (isOpen && dropdownRef.current && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const dropdownHeight = dropdownRef.current.offsetHeight;
                const windowHeight = window.innerHeight;
                const spaceBelow = windowHeight - rect.bottom;

                // Check if enough space below
                const placement = spaceBelow < dropdownHeight ? 'top' : 'bottom';

                setDropdownPosition({
                    top: placement === 'top'
                        ? rect.top + window.scrollY - dropdownHeight
                        : rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    placement
                });
            }
        }, [isOpen]);

        // Update position when dropdown is rendered and dimensions are available
        React.useEffect(() => {
            // Single frame delay to ensure the dropdown has rendered with its content
            if (isOpen && dropdownRef.current) {
                const timeoutId = setTimeout(updateDropdownPosition, 0);
                return () => clearTimeout(timeoutId);
            }
        }, [isOpen, updateDropdownPosition]);

        // Scroll and resize event listeners to update dropdown position
        React.useEffect(() => {
            const handlePositionUpdate = () => {
                if (isOpen && triggerRef.current && dropdownRef.current) {
                    // Request animation frame to avoid frequent updates
                    requestAnimationFrame(updateDropdownPosition);
                }
            };

            window.addEventListener('scroll', handlePositionUpdate, true);
            window.addEventListener('resize', handlePositionUpdate);
            return () => {
                window.removeEventListener('scroll', handlePositionUpdate, true);
                window.removeEventListener('resize', handlePositionUpdate);
            };
        }, [isOpen, updateDropdownPosition]);

        const handleSelect = (value: string) => {
            setSelectedValue(value);
            if (onChange) {
                // Synthetic event for backward compatibility
                const event = {
                    target: {
                        value,
                        name: name || '',
                    }
                } as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
            }
            setIsOpen(false);
            setSearchQuery("");
        };

        return (
            <div className={cn("relative", containerClassName)} ref={ref}>
                {label && (
                    <label className="block text-sm font-medium text-black-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative" ref={triggerRef}>
                    <div
                        style={style}
                        className={cn(
                            "flex items-center h-10 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-8 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
                            error ? "border-red-500" : "",
                            className
                        )}
                        onClick={(e) => {
                            if (!disabled) {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpen(prev => !prev);
                            }
                        }}
                    >
                        <span className="truncate">
                          {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {loading ? (
                                <svg
                                    className="animate-spin h-4 w-4 text-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-500"
                                >
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            )}
                        </div>
                    </div>

                    {isOpen && createPortal(
                        <div
                            ref={dropdownRef}
                            className="fixed z-[50] bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
                            style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                width: dropdownPosition.width,
                                maxHeight: '250px'
                            }}
                        >
                            <div className="p-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>
                            <div className="py-1">
                                {filteredOptions.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100",
                                                option.value === selectedValue ? "bg-primary/10 text-primary" : "",
                                                option.disabled ? "opacity-50 cursor-not-allowed" : ""
                                            )}
                                            onClick={() => !option.disabled && handleSelect(option.value)}
                                        >
                                            {option.label}
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Observer element to detect changes in filtered options */}
                            <div ref={node => {
                                if (node && isOpen) {
                                    // Use ResizeObserver to detect size changes
                                    const resizeObserver = new ResizeObserver(() => {
                                        requestAnimationFrame(updateDropdownPosition);
                                    });
                                    resizeObserver.observe(node.parentElement as Element);
                                    return () => resizeObserver.disconnect();
                                }
                            }} />
                        </div>,
                        document.body
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
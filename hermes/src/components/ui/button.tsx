"use client"
import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
                slide:
                    "relative overflow-visible bg-gradient-to-r from-primary to-secondary text-white transition-all duration-500 ease-in-out group hover:shadow-lg hover:scale-105",
            },
            size: {
                xs: "h-7 px-2 py-1 text-xs gap-1 has-[>svg]:px-1.5",
                sm: "h-8 px-3 py-1.5 text-xs gap-1.5 has-[>svg]:px-2.5",
                default: "h-9 px-4 py-2 text-sm gap-2 has-[>svg]:px-3",
                lg: "h-11 px-6 py-2.5 text-sm gap-2 has-[>svg]:px-4",
                xl: "h-14 px-8 py-3 text-base gap-3 has-[>svg]:px-6",
                "2xl": "h-16 px-10 py-4 text-lg gap-3 has-[>svg]:px-8",
                icon: "size-9",
                "icon-sm": "size-7",
                "icon-lg": "size-11",
                "icon-xl": "size-14",
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                default: "rounded-md",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-2xl",
                "3xl": "rounded-3xl",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            radius: "default",
        },
    }
)

interface SlideButtonProps {
    name1: string
    name2: string
    slideDelay?: number
    maxWidth?: string
    icon?: React.ComponentType<{ className?: string }>
    iconPosition?: "left" | "right"
}

function Button({
                    className,
                    variant,
                    size,
                    radius,
                    asChild = false,
                    children,
                    onClick,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
} & (variant extends "slide" ? SlideButtonProps : {})) {

    const [isHovered, setIsHovered] = React.useState(false)
    const [isClicked, setIsClicked] = React.useState(false)

    const handleSlideClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (variant === "slide") {
            setIsClicked(true)
            const delay = (props as SlideButtonProps).slideDelay || 1000
            setTimeout(() => {
                onClick?.(e)
                setIsClicked(false)
            }, delay)
        } else {
            onClick?.(e)
        }
    }, [onClick, variant, (props as SlideButtonProps).slideDelay])

    const Comp = asChild ? Slot : "button"

    // For slide variant, render custom content
    if (variant === "slide") {
        const { name1, name2, maxWidth = "max-w-sm", icon: CustomIcon = ArrowRight, iconPosition = "right" } = props as SlideButtonProps

        // text size based on button size
        const getTextSize = (size: string | undefined) => {
            switch (size) {
                case "xs": return "text-xs"
                case "sm": return "text-xs"
                case "default": return "text-sm"
                case "lg": return "text-sm"
                case "xl": return "text-base"
                case "2xl": return "text-lg"
                default: return "text-sm"
            }
        }

        // icon size based on button size
        const getIconSize = (size: string | undefined) => {
            switch (size) {
                case "xs": return "h-3 w-3"
                case "sm": return "h-4 w-4"
                case "default": return "h-5 w-5"
                case "lg": return "h-5 w-5"
                case "xl": return "h-6 w-6"
                case "2xl": return "h-7 w-7"
                default: return "h-5 w-5"
            }
        }

        // padding based on button size for slide variant
        const getSlidePadding = (size: string | undefined) => {
            switch (size) {
                case "xs": return "px-3 py-1.5"
                case "sm": return "px-4 py-2"
                case "default": return "px-6 py-3"
                case "lg": return "px-8 py-3.5"
                case "xl": return "px-10 py-4"
                case "2xl": return "px-12 py-5"
                default: return "px-6 py-3"
            }
        }

        const textSizeClass = getTextSize(size)
        const iconSizeClass = getIconSize(size)
        const slidePaddingClass = getSlidePadding(size)

        return (
            <Comp
                data-slot="button"
                className={cn(
                    buttonVariants({ variant, size, radius }),
                    slidePaddingClass,
                    "min-w-fit w-auto flex-nowrap",
                    textSizeClass,
                    maxWidth,
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleSlideClick}
                disabled={isClicked}
                {...(props as any)}
            >
                {/* Content Container */}
                <div className={cn(
                    "flex items-center justify-center gap-3 w-full min-w-0",
                    iconPosition === "left" ? "flex-row-reverse" : "flex-row"
                )}>
                    {/* Text Container */}
                    <div className="relative flex-1 flex items-center justify-center min-w-0">
                        <span
                            className={`transition-all duration-500 text-center block ${textSizeClass} ${
                                isHovered ? "opacity-0 -translate-y-0" : "opacity-100"
                            }`}
                        >
                            {name1}
                        </span>
                        <span
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 text-center ${textSizeClass} ${
                                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            {name2}
                        </span>
                    </div>

                    {/* Icon Container */}
                    <div className={cn("relative flex-shrink-0", iconSizeClass)}>
                        <CustomIcon
                            className={cn(iconSizeClass, `absolute transition-all duration-1000 ${
                                isHovered ? "opacity-0 -translate-y-8" : "opacity-100"
                            } ${isClicked ? "translate-x-[200px]" : ""}`)}
                        />
                        <CustomIcon
                            className={cn(iconSizeClass, `absolute transition-all duration-1000 
                            ${
                                isHovered
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                            }
                            ${isClicked ? "translate-x-[200px]" : ""}`)}
                        />
                    </div>
                </div>

                {/* Background overlays */}
                <span className={cn(
                    "absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left",
                    radius === "full" ? "rounded-full" : `rounded-${radius || "md"}`
                )} />
                <span className={cn(
                    "absolute inset-0 w-full h-full bg-white/20 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out origin-bottom",
                    radius === "full" ? "rounded-full" : `rounded-${radius || "md"}`
                )} />
            </Comp>
        )
    }

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, radius, className }))}
            onClick={handleSlideClick}
            {...props}
        >
            {children}
        </Comp>
    )
}

export { Button, buttonVariants }
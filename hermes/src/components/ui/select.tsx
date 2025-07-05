"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "./input"

// Extended context to handle search functionality
interface SelectContextValue {
    searchable?: boolean;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
    searchValue: "",
    setSearchValue: () => {},
});

interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
    searchable?: boolean;
}

function Select({
                    children,
                    searchable,
                    onOpenChange,
                    ...props
                }: SelectProps) {
    const [searchValue, setSearchValue] = React.useState("");

    // Reset search value when select is closed
    const handleOpenChange = React.useCallback((open: boolean) => {
        if (!open) {
            setSearchValue("");
        }
        onOpenChange?.(open);
    }, [onOpenChange]);

    return (
        <SelectContext.Provider
            value={{
                searchable,
                searchValue,
                setSearchValue
            }}
        >
            <SelectPrimitive.Root
                data-slot="select"
                onOpenChange={handleOpenChange}
                {...props}
            >
                {children}
            </SelectPrimitive.Root>
        </SelectContext.Provider>
    )
}

function SelectGroup({
                         ...props
                     }: React.ComponentProps<typeof SelectPrimitive.Group>) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

// Add displayName for better debugging
SelectGroup.displayName = "SelectGroup";

function SelectValue({
                         ...props
                     }: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
}

function SelectTrigger({
                           className,
                           size = "default",
                           children,
                           ...props
                       }: SelectTriggerProps) {
    const sizeClasses = {
        xs: "h-7 px-2 py-1 text-sm gap-2 rounded-md min-w-0 w-full",
        sm: "h-8 px-2.5 py-1.5 text-sm gap-2 rounded-md min-w-0 w-full",
        default: "h-9 px-3 py-1 text-base shadow-xs rounded-md min-w-0 w-full md:text-sm",
        md: "h-10 px-3.5 py-2 text-sm gap-2 rounded-md min-w-0 w-full",
        lg: "h-11 px-4 py-2.5 text-sm gap-2 rounded-md min-w-0 w-full",
        xl: "h-12 px-5 py-3 text-sm gap-2 rounded-md min-w-0 w-full"
    }

    const iconSizes = {
        xs: "size-4",
        sm: "size-4",
        default: "size-4",
        md: "size-4",
        lg: "size-4",
        xl: "size-4"
    }

    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between whitespace-nowrap border bg-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className={cn("opacity-50", iconSizes[size])} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

interface SelectContentProps extends React.ComponentProps<typeof SelectPrimitive.Content> {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
}

function SelectContent({
                           className,
                           children,
                           position = "popper",
                           size = "default",
                           onCloseAutoFocus,
                           ...props
                       }: SelectContentProps) {
    const contentSizes = {
        xs: "text-sm min-w-[8rem]",
        sm: "text-sm min-w-[8rem]",
        default: "text-base min-w-[8rem] md:text-sm",
        md: "text-sm min-w-[8rem]",
        lg: "text-sm min-w-[8rem]",
        xl: "text-sm min-w-[8rem]"
    }

    const { searchable, searchValue, setSearchValue } = React.useContext(SelectContext);

    // Store original children for filtering
    const [noResults, setNoResults] = React.useState(false);

    // Function to get text content from a React element
    const getTextContent = (element: React.ReactNode): string => {
        if (typeof element === 'string') return element;
        if (typeof element === 'number') return element.toString();
        if (React.isValidElement(element)) {
            // Check by displayName or name instead of direct type comparison
            const elementType = element.type as any;
            const isSelectItem = elementType?.displayName === 'SelectItem' ||
                elementType?.name === 'SelectItem' ||
                element.props?.['data-slot'] === 'select-item';

            if (isSelectItem) {
                return getTextContent(element.props.children);
            }

            // Handle other elements with children
            if (element.props && element.props.children) {
                if (Array.isArray(element.props.children)) {
                    return element.props.children.map(child => getTextContent(child)).join(' ');
                }
                return getTextContent(element.props.children);
            }
        }
        if (Array.isArray(element)) {
            return element.map(item => getTextContent(item)).join(' ');
        }
        return '';
    };

    // Function to check if an element is a SelectItem
    const isSelectItemElement = (element: React.ReactNode): boolean => {
        if (!React.isValidElement(element)) return false;
        const elementType = element.type as any;
        return elementType?.displayName === 'SelectItem' ||
            elementType?.name === 'SelectItem' ||
            element.props?.['data-slot'] === 'select-item';
    };

    // Function to check if an element is a SelectGroup
    const isSelectGroupElement = (element: React.ReactNode): boolean => {
        if (!React.isValidElement(element)) return false;
        const elementType = element.type as any;
        return elementType?.displayName === 'SelectGroup' ||
            elementType?.name === 'SelectGroup' ||
            element.props?.['data-slot'] === 'select-group';
    };

    // Function to check if a child matches the search
    const childMatches = React.useCallback((child: React.ReactNode): boolean => {
        if (!React.isValidElement(child)) return false;
        if (!searchValue.trim()) return true;

        // Only check SelectItem elements for matching
        if (isSelectItemElement(child)) {
            const textContent = getTextContent(child);
            return textContent.toLowerCase().includes(searchValue.toLowerCase().trim());
        }

        return false;
    }, [searchValue]);

    // Filter children only when necessary (with search)
    const renderChildren = React.useMemo(() => {
        if (!searchable || !searchValue.trim()) {
            setNoResults(false);
            return children;
        }

        const childrenArray = React.Children.toArray(children);
        const filteredChildren: React.ReactNode[] = [];

        childrenArray.forEach(child => {
            if (!React.isValidElement(child)) {
                return;
            }

            if (isSelectGroupElement(child)) {
                // Filter items in a group
                const groupChildren = React.Children.toArray(child.props.children);
                const filteredGroupChildren = groupChildren.filter(groupChild => {
                    return childMatches(groupChild);
                });

                if (filteredGroupChildren.length > 0) {
                    // Return the group with only matching children
                    filteredChildren.push(
                        React.cloneElement(child as React.ReactElement<any>, {
                            ...child.props,
                            children: filteredGroupChildren
                        })
                    );
                }
            } else if (isSelectItemElement(child)) {
                // Direct select item
                if (childMatches(child)) {
                    filteredChildren.push(child);
                }
            } else {
                // Pass through other elements (separators, labels, etc.) but only if they're not SelectItems
                if (!isSelectItemElement(child)) {
                    filteredChildren.push(child);
                }
            }
        });

        // Check if we have any SelectItem results
        const hasResults = filteredChildren.some(child => {
            if (!React.isValidElement(child)) return false;
            if (isSelectItemElement(child)) return true;
            if (isSelectGroupElement(child)) {
                const groupChildren = React.Children.toArray(child.props.children);
                return groupChildren.some(groupChild => isSelectItemElement(groupChild));
            }
            return false;
        });

        setNoResults(!hasResults);
        return filteredChildren;
    }, [children, searchable, searchValue, childMatches]);

    const handleCloseAutoFocus = React.useCallback((event: Event) => {
        if (searchable) {
            // Prevent focus issues when using custom search
            event.preventDefault();
        }
        onCloseAutoFocus?.(event);
    }, [searchable, onCloseAutoFocus]);

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
                    position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    contentSizes[size],
                    className
                )}
                position={position}
                onCloseAutoFocus={handleCloseAutoFocus}
                {...props}
            >
                <SelectScrollUpButton size={size} />
                {searchable && (
                    <div className="px-2 pt-2 pb-1 sticky top-0 z-10 bg-popover border-b">
                        <div className="relative">
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search options..."
                                className="pl-8 h-8"
                                onKeyDown={(e) => {
                                    // Prevent select navigation while typing in search
                                    e.stopPropagation();
                                }}
                                autoFocus
                            />
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1",
                        position === "popper" &&
                        "w-full min-w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-y-auto"
                    )}
                >
                    {renderChildren}
                    {noResults && searchable && searchValue && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No options found for "{searchValue}"
                        </div>
                    )}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton size={size} />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

interface SelectLabelProps extends React.ComponentProps<typeof SelectPrimitive.Label> {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
}

function SelectLabel({
                         className,
                         size = "default",
                         ...props
                     }: SelectLabelProps) {
    const labelSizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-2 py-1.5 text-xs",
        default: "px-2 py-1.5 text-xs",
        md: "px-2 py-1.5 text-xs",
        lg: "px-2 py-1.5 text-xs",
        xl: "px-2 py-1.5 text-xs"
    }

    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn("text-muted-foreground", labelSizes[size], className)}
            {...props}
        />
    )
}

interface SelectItemProps extends React.ComponentProps<typeof SelectPrimitive.Item> {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
}

function SelectItem({
                        className,
                        children,
                        size = "default",
                        ...props
                    }: SelectItemProps) {
    const itemSizes = {
        xs: "py-1 pr-8 pl-2 text-sm gap-2 rounded-sm",
        sm: "py-1.5 pr-8 pl-2 text-sm gap-2 rounded-sm",
        default: "py-1.5 pr-8 pl-2 text-sm gap-2 rounded-sm",
        md: "py-2 pr-8 pl-2 text-sm gap-2 rounded-sm",
        lg: "py-2.5 pr-8 pl-2 text-sm gap-2 rounded-sm",
        xl: "py-3 pr-8 pl-2 text-sm gap-2 rounded-sm"
    }

    const indicatorSizes = {
        xs: "size-3.5 right-2",
        sm: "size-3.5 right-2",
        default: "size-3.5 right-2",
        md: "size-3.5 right-2",
        lg: "size-3.5 right-2",
        xl: "size-3.5 right-2"
    }

    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                itemSizes[size],
                className
            )}
            {...props}
        >
      <span className={cn("absolute flex items-center justify-center", indicatorSizes[size])}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

// Add displayName for better debugging
SelectItem.displayName = "SelectItem";

function SelectSeparator({
                             className,
                             ...props
                         }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
            {...props}
        />
    )
}

interface SelectScrollButtonProps extends React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
}

function SelectScrollUpButton({
                                  className,
                                  size = "default",
                                  ...props
                              }: SelectScrollButtonProps) {
    const buttonSizes = {
        xs: "py-1",
        sm: "py-1",
        default: "py-1",
        md: "py-1",
        lg: "py-1",
        xl: "py-1"
    }

    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(
                "flex cursor-default items-center justify-center",
                buttonSizes[size],
                className
            )}
            {...props}
        >
            <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>
    )
}

function SelectScrollDownButton({
                                    className,
                                    size = "default",
                                    ...props
                                }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> & {
    size?: "xs" | "sm" | "default" | "md" | "lg" | "xl"
}) {
    const buttonSizes = {
        xs: "py-1",
        sm: "py-1",
        default: "py-1",
        md: "py-1",
        lg: "py-1",
        xl: "py-1"
    }

    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(
                "flex cursor-default items-center justify-center",
                buttonSizes[size],
                className
            )}
            {...props}
        >
            <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
    )
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
}
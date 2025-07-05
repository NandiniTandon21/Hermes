"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  multiline?: boolean;
  rows?: number;
}

const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({
    className,
    error,
    icon,
    containerClassName,
    type = 'text',
    multiline = false,
    rows = 3,
    ...props
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (multiline && e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        target.value = target.value.substring(0, start) + '\n' + target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;
      }
    };

    const baseInputStyles = cn(
      "h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm leading-10 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
      icon ? "pl-10" : "",
      error ? "border-red-500" : "border-input",
      className
    );

    const baseTextareaStyles = cn(
      "w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm leading-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto whitespace-pre-wrap break-words",
      icon ? "pl-10" : "",
      error ? "border-red-500" : "border-input",
      className
    );

    return (
      <div className={cn("relative", containerClassName)}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        {multiline ? (
          <textarea
            className={baseTextareaStyles}
            rows={rows}
            onKeyDown={handleKeyDown}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            className={baseInputStyles}
            ref={ref as React.Ref<HTMLInputElement>}
            {...props}
          />
        )}

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input }

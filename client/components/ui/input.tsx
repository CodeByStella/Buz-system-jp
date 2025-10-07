import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    const isInteractive = !props.disabled && !props.readOnly
    // If type is number, add text-right to align number to right
    const numberAlignClass = type === "number" ? "text-right" : ""
    // If value is undefined or null, show blank
    const inputValue = value === undefined || value === null ? "" : value
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full box-border border-2 border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-700 read-only:bg-yellow-300",
          isInteractive && "focus:border-primary",
          numberAlignClass,
          className
        )}
        ref={ref}
        value={inputValue}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

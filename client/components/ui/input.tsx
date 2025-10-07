import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, prefix, suffix, step, ...props }, ref) => {
    const isInteractive = !props.disabled && !props.readOnly
    // If type is number, add text-right to align number to right
    const numberAlignClass = type === "number" ? "text-right" : ""
    // If value is undefined or null, show blank
    let inputValue = value === undefined || value === null ? "" : value
    
    // Format number to 3 decimal places if it's a float
    if (type === "number" && inputValue !== "" && typeof inputValue === "number") {
      // Check if it's a decimal number
      if (!Number.isInteger(inputValue)) {
        inputValue = Number(inputValue).toFixed(3)
      }
    }
    
    // Default step for number inputs
    const defaultStep = type === "number" && !step ? "0.001" : step
    
    // Prevent scroll from changing number input value
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur()
      }
    }
    
    const inputElement = (
      <input
        type={type}
        step={defaultStep}
        onWheel={handleWheel}
        className={cn(
          "absolute inset-0 w-full h-full box-border border-2 border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-700 read-only:bg-yellow-300",
          isInteractive && "focus:border-primary",
          numberAlignClass,
          prefix && "pl-8",
          suffix && "pr-8",
          className
        )}
        ref={ref}
        value={inputValue}
        {...props}
      />
    )

    if (prefix || suffix) {
      return (
        <div className="absolute inset-0 w-full h-full">
          {prefix && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none z-10">
              {prefix}
            </span>
          )}
          {inputElement}
          {suffix && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none z-10">
              {suffix}
            </span>
          )}
        </div>
      )
    }

    return inputElement
  }
)
Input.displayName = "Input"

export { Input }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // red primary
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // blue for calculate
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        export: "bg-gray-200 text-gray-900 hover:bg-gray-300", // gray for export
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-md px-10 text-lg", // larger padding
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ComponentType<{ className?: string }> | React.ReactNode
  rightIcon?: React.ComponentType<{ className?: string }> | React.ReactNode
  iconOnly?: boolean
  fullWidth?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    fullWidth = false,
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Render icon helper
    const renderIcon = (icon: React.ComponentType<{ className?: string }> | React.ReactNode, iconSize: string = "h-4 w-4") => {
      if (!icon) return null
      
      // Check if it's already a valid React element
      if (React.isValidElement(icon)) {
        return icon
      }
      
      // Check if it's a component type (function, class, or forwardRef)
      // This handles Lucide icons which are forwardRef components
      if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && ('$$typeof' in icon || 'render' in icon))) {
        const IconComponent = icon as React.ComponentType<{ className?: string }>
        return <IconComponent className={iconSize} />
      }
      
      // Otherwise render as React node
      return icon
    }

    const iconSizeMap = {
      default: "h-4 w-4",
      sm: "h-3.5 w-3.5",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
      icon: "h-5 w-5",
    }

    const iconSize = iconSizeMap[size || "default"]

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full",
          loading && "cursor-not-allowed"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className={cn(iconSize, "animate-spin", !iconOnly && (loadingText || children) && "mr-2")} />
        )}
        
        {!loading && leftIcon && (
          <span className={cn(!iconOnly && children && "mr-2")}>
            {renderIcon(leftIcon, iconSize)}
          </span>
        )}
        
        {!iconOnly && (
          <span>{loading && loadingText ? loadingText : children}</span>
        )}
        
        {!loading && rightIcon && (
          <span className={cn(!iconOnly && children && "ml-2")}>
            {renderIcon(rightIcon, iconSize)}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

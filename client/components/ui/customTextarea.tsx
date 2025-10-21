import * as React from "react"
import * as ReactDOM from "react-dom"

import { cn } from "@/lib/utils"
import { useDataContext } from "@/lib/contexts/DataContext"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  tip?: string;
  tipClassName?: string;
  tipStyle?: React.CSSProperties;
  sheet?: string;
  cell?: string;
}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, tip, tipClassName, tipStyle, sheet, cell, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [tooltipPosition, setTooltipPosition] = React.useState<{ top: number; left: number } | null>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const isInteractive = !props.disabled && !props.readOnly
    
    // Use DataContext if sheet and cell are provided
    const hasContext = sheet && cell;
    let contextValue: string | number | undefined;
    let contextOnChange: ((sheet: string, cell: string, value: number | string) => void) | undefined;
    
    try {
      const context = hasContext ? useDataContext() : { getCell: () => undefined, onChange: () => {} };
      contextValue = hasContext ? context.getCell(sheet!, cell!) : undefined;
      contextOnChange = hasContext ? context.onChange : undefined;
    } catch (e) {
      // Context not available, use props
      contextValue = undefined;
      contextOnChange = undefined;
    }
    
    // Determine the actual value to display
    // Priority: contextValue (from DataContext) > value prop
    let textareaValue = hasContext && contextValue !== undefined ? String(contextValue) : value;
    // If value is undefined or null, show blank
    textareaValue = textareaValue === undefined || textareaValue === null ? "" : textareaValue;
    
    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)
    
    // Update tooltip position when focused
    const updateTooltipPosition = React.useCallback(() => {
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect()
        setTooltipPosition({
          top: rect.top + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX
        })
      }
    }, [])
    
    // Handle focus events for tip display
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // CRITICAL FIX: Prevent focus on readonly cells
      if (props.readOnly) {
        e.currentTarget.blur();
        return;
      }
      
      setIsFocused(true)
      updateTooltipPosition()
      props.onFocus?.(e)
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      setTooltipPosition(null)
      props.onBlur?.(e)
    }
    
    // Update position on scroll or resize
    React.useEffect(() => {
      if (isFocused && tip) {
        updateTooltipPosition()
        window.addEventListener('scroll', updateTooltipPosition, true)
        window.addEventListener('resize', updateTooltipPosition)
        
        return () => {
          window.removeEventListener('scroll', updateTooltipPosition, true)
          window.removeEventListener('resize', updateTooltipPosition)
        }
      }
    }, [isFocused, tip, updateTooltipPosition])
    
    // Handle change event - use context if available, otherwise use prop
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // CRITICAL FIX: Prevent changes to readonly cells
      if (props.readOnly) {
        e.preventDefault();
        return;
      }
      
      if (hasContext && contextOnChange) {
        const newValue = e.target.value;
        contextOnChange(sheet!, cell!, newValue);
      } else if (onChange) {
        onChange(e);
      }
    };
    
    const textareaElement = (
      <textarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={cn(
          "w-full h-full box-border border-2 border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-700 read-only:bg-yellow-300 read-only:cursor-default resize-none",
          isInteractive && "focus:border-primary",
          className
        )}
        ref={textareaRef}
        value={textareaValue}
        {...props}
      />
    )

    // Render tip tooltip with arrow using Portal
    const tipElement = tip && isFocused && tooltipPosition && typeof document !== 'undefined' && ReactDOM.createPortal(
      <div 
        className={cn(
          "fixed z-[99999] w-max max-w-xs bg-yellow-200 text-gray-900 text-xs px-3 py-2 rounded shadow-xl border border-yellow-400 pointer-events-none whitespace-normal text-left",
          tipClassName
        )}
        style={{
          top: `${tooltipPosition.top - 8}px`,
          left: `${tooltipPosition.left}px`,
          transform: 'translate(-50%, -100%)',
          ...tipStyle
        }}
      >
        {tip}
        {/* Tooltip arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-yellow-200"></div>
      </div>,
      document.body
    )

    return (
      <div className="relative w-full h-full">
        {textareaElement}
        {tipElement}
      </div>
    )
  }
)
CustomTextarea.displayName = "Textarea"

export { CustomTextarea }

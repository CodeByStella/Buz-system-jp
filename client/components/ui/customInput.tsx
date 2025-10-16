import * as React from "react";
import * as ReactDOM from "react-dom";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/lib/contexts/DataContext";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  tip?: string;
  tipClassName?: string;
  tipStyle?: React.CSSProperties;
  sheet?: string;
  cell?: string;
  renderValue?: (value: number | string) => number | string;
  inverseRenderValue?: (value: number) => number;
  // When true and type === "number", display with thousands separators (e.g., 10,202,000)
  formatThousands?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      value,
      prefix,
      suffix,
      step,
      tip,
      tipClassName,
      tipStyle,
      sheet,
      cell,
      onChange,
      renderValue,
      inverseRenderValue,
      formatThousands = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [tooltipPosition, setTooltipPosition] = React.useState<{
      top: number;
      left: number;
    } | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isInteractive = !props.disabled && !props.readOnly;

    // Use DataContext if sheet and cell are provided
    const hasContext = sheet && cell;
    let contextValue: string | number | undefined;
    let contextOnChange:
      | ((sheet: string, cell: string, value: number | string) => void)
      | undefined;

    try {
      const context = hasContext
        ? useDataContext()
        : { getCell: () => undefined, onChange: () => {} };
      contextValue = hasContext ? context.getCell(sheet!, cell!) : undefined;
      contextOnChange = hasContext ? context.onChange : undefined;
    } catch (e) {
      // Context not available, use props
      contextValue = undefined;
      contextOnChange = undefined;
    }

    // If type is number, add text-right to align number to right
    const numberAlignClass = type === "number" ? "text-right" : "";

    // Determine if we should display thousands separators
    const useThousandsFormatting = type === "number" && !!formatThousands;

    // Calculate dynamic padding based on suffix length
    const getSuffixPadding = () => {
      if (!suffix || typeof suffix !== "string") return "";

      // Estimate character width (roughly 8-12px per character for Japanese text)
      const estimatedWidth = suffix.length * 10; // 10px per character
      const minPadding = 32; // pr-8 = 32px minimum
      const calculatedPadding = Math.max(minPadding, estimatedWidth + 16); // Add 16px buffer

      // Convert to Tailwind classes (approximate)
      if (calculatedPadding <= 32) return "pr-8"; // 32px
      if (calculatedPadding <= 48) return "pr-12"; // 48px
      if (calculatedPadding <= 64) return "pr-16"; // 64px
      if (calculatedPadding <= 80) return "pr-20"; // 80px
      if (calculatedPadding <= 96) return "pr-24"; // 96px
      return "pr-28"; // 112px for very long suffixes
    };

    // Calculate dynamic suffix positioning
    const getSuffixPosition = () => {
      if (!suffix || typeof suffix !== "string") return "right-2";

      const estimatedWidth = suffix.length * 10;
      if (estimatedWidth <= 30) return "right-2"; // 8px
      if (estimatedWidth <= 50) return "right-3"; // 12px
      if (estimatedWidth <= 70) return "right-4"; // 16px
      return "right-5"; // 20px for very long suffixes
    };

    // Determine the actual value to display
    // Priority: contextValue (from DataContext) > value prop
    let inputValue =
      hasContext && contextValue !== undefined ? contextValue : value;
    // If value is undefined or null, show blank
    inputValue =
      inputValue === undefined || inputValue === null ? "" : inputValue;

    // Sanitize error values before setting on HTML input
    if (typeof inputValue === "string") {
      // Check for error values that HTML input can't parse
      if (
        inputValue.includes("#DIV/0!") ||
        inputValue.includes("#N/A") ||
        inputValue.includes("#NAME?") ||
        inputValue.includes("#NUM!") ||
        inputValue.includes("#REF!") ||
        inputValue.includes("#VALUE!") ||
        inputValue.includes("#CYCLE!") ||
        inputValue.includes("#ERROR!") ||
        inputValue.includes("#LIC!")
      ) {
        console.warn(
          `Detected error value in input: ${inputValue}, converting to empty string`
        );
        inputValue = "";
      }
    }

    // Apply custom render function if provided (e.g., multiply by 100 for percentages)
    if (
      renderValue &&
      inputValue !== "" &&
      !Array.isArray(inputValue) &&
      (typeof inputValue === "string" || typeof inputValue === "number")
    ) {
      // Only apply renderValue to complete numbers, not intermediate states like "12."
      if (typeof inputValue === "number" || (typeof inputValue === "string" && /^-?\d+\.?\d*$/.test(inputValue) && !inputValue.endsWith("."))) {
        inputValue = renderValue(inputValue as string | number);
      }
    }

    // Check if the value is negative for styling
    const numericValue =
      typeof inputValue === "number"
        ? inputValue
        : parseFloat(inputValue as string);
    const isNegative =
      type === "number" && !isNaN(numericValue) && numericValue < 0;
    const negativeClass = isNegative ? "text-red-600" : "";

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Format number to 3 decimal places if it's a float
    if (
      type === "number" &&
      inputValue !== "" &&
      typeof inputValue === "number"
    ) {
      // Check if it's a decimal number
      if (!Number.isInteger(inputValue)) {
        inputValue = Number(inputValue).toFixed(1);
      }
    }

    // Apply thousands separator formatting for display only
    if (useThousandsFormatting && inputValue !== "") {
      const rawString = String(inputValue);
      // Only attempt to format if string contains only digits, optional minus, commas, and a single dot
      const numericLikePattern =
        /^-?[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]*)?$|^-?[0-9]*(?:\.[0-9]*)?$/;
      const canFormat =
        typeof inputValue === "number" || numericLikePattern.test(rawString);
      if (canFormat) {
        const num =
          typeof inputValue === "number"
            ? inputValue
            : parseFloat(rawString.replace(/,/g, ""));
        if (!isNaN(num)) {
          // Preserve decimals if present, including intermediate states like "12."
          const [, decPart] = rawString.split(".");
          const formattedInt = new Intl.NumberFormat(undefined).format(
            Math.trunc(num)
          );
          inputValue =
            decPart !== undefined
              ? `${formattedInt}.${decPart}`
              : formattedInt;
        }
      }
    }

    // Default step for number inputs
    const defaultStep = type === "number" && !step ? "0.001" : step;

    // Prevent scroll from changing number input value
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur();
      }
    };

    // Update tooltip position when focused
    const updateTooltipPosition = React.useCallback(() => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
      }
    }, []);

    // Handle focus events for tip display
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      updateTooltipPosition();
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setTooltipPosition(null);
      props.onBlur?.(e);
    };

    // Update position on scroll or resize
    React.useEffect(() => {
      if (isFocused && tip) {
        updateTooltipPosition();
        window.addEventListener("scroll", updateTooltipPosition, true);
        window.addEventListener("resize", updateTooltipPosition);

        return () => {
          window.removeEventListener("scroll", updateTooltipPosition, true);
          window.removeEventListener("resize", updateTooltipPosition);
        };
      }
    }, [isFocused, tip, updateTooltipPosition]);

    // Handle change event - use context if available, otherwise use prop
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasContext && contextOnChange) {
        if (type === "number") {
          // Handle numeric input
          const raw = useThousandsFormatting
            ? e.target.value.replace(/,/g, "")
            : e.target.value;
          
          // Allow intermediate decimal input (e.g., "12." should be preserved)
          let newValue: number | string = raw;
          
          // Only parse as float if the input is a complete number or empty
          if (raw === "" || raw === "-" || /^-?\d+\.?\d*$/.test(raw)) {
            const parsed = parseFloat(raw);
            if (!isNaN(parsed)) {
              newValue = parsed;
            } else if (raw === "" || raw === "-") {
              newValue = 0;
            } else {
              // Keep the raw string for intermediate states like "12."
              newValue = raw;
            }
          }

          // Apply inverse transformation if provided (e.g., divide by 100 for percentages)
          if (inverseRenderValue && typeof newValue === "number") {
            newValue = inverseRenderValue(newValue);
          }

          contextOnChange(sheet!, cell!, newValue);
        } else {
          // Handle string/text input
          contextOnChange(sheet!, cell!, e.target.value);
        }
      } else if (onChange) {
        onChange(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow parent handlers to run first
      props.onKeyDown?.(e);
      if (e.defaultPrevented) return;

      // Enter navigation: move focus to next input in same sheet (DOM order)
      if (e.key === "Enter") {
        e.preventDefault();
        const selector = sheet ? `input[data-sheet="${sheet}"]` : "input";
        const allInputs = Array.from(
          document.querySelectorAll<HTMLInputElement>(selector)
        ).filter((el) => !el.disabled && el.tabIndex !== -1);
        const current = e.currentTarget;
        const idx = allInputs.indexOf(current);
        const next =
          idx >= 0 && idx + 1 < allInputs.length
            ? allInputs[idx + 1]
            : allInputs[0];
        // Move focus and select content for quick overwrite
        next?.focus();
        try {
          next?.select?.();
        } catch {}
      }
    };

    const inputElement = (
      <input
        type={useThousandsFormatting ? "text" : type}
        step={defaultStep}
        onWheel={handleWheel}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className={cn(
          "absolute inset-0 w-full h-full box-border border-2 border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-700 read-only:bg-yellow-300",
          isInteractive && "focus:border-primary",
          numberAlignClass,
          negativeClass,
          prefix && "pl-8",
          suffix && getSuffixPadding(),
          className
        )}
        ref={inputRef}
        value={inputValue}
        data-sheet={sheet}
        data-cell={cell}
        {...props}
      />
    );

    // Render tip tooltip with arrow using Portal
    const tipElement =
      tip &&
      isFocused &&
      tooltipPosition &&
      typeof document !== "undefined" &&
      ReactDOM.createPortal(
        <div
          className={cn(
            "fixed z-[99999] w-max max-w-xs bg-yellow-200 text-gray-900 text-xs px-3 py-2 rounded shadow-xl border border-yellow-400 pointer-events-none whitespace-normal text-left",
            tipClassName
          )}
          style={{
            top: `${tooltipPosition.top - 8}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translate(-50%, -100%)",
            ...tipStyle,
          }}
        >
          {tip}
          {/* Tooltip arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-yellow-200"></div>
        </div>,
        document.body
      );

    if (prefix || suffix) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full">
            {prefix && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none z-10">
                {prefix}
              </span>
            )}
            {inputElement}
            {suffix && (
              <span
                className={`absolute top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none z-10 ${getSuffixPosition()}`}
              >
                {suffix}
              </span>
            )}
          </div>
          {tipElement}
        </div>
      );
    }

    return (
      <div className="absolute inset-0 w-full h-full">
        {inputElement}
        {tipElement}
      </div>
    );
  }
);
CustomInput.displayName = "Input";

export { CustomInput };

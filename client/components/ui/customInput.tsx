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
    const [localValue, setLocalValue] = React.useState<string>("");
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
    // When focused, use local value; otherwise use context/prop value
    let inputValue: string | number;
    if (isFocused) {
      inputValue = localValue;
    } else {
      // Priority: contextValue (from DataContext) > value prop
      const rawValue = hasContext && contextValue !== undefined ? contextValue : value;
      // If value is undefined or null, show blank
      if (rawValue === undefined || rawValue === null) {
        inputValue = "";
      } else if (Array.isArray(rawValue)) {
        inputValue = rawValue.join(", ");
      } else if (typeof rawValue === "string" || typeof rawValue === "number") {
        inputValue = rawValue;
      } else {
        inputValue = String(rawValue);
      }
    }

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
      if (
        typeof inputValue === "number" ||
        (typeof inputValue === "string" &&
          /^-?\d+\.?\d*$/.test(inputValue) &&
          !inputValue.endsWith("."))
      ) {
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

    // Format number to 1 decimal place for any numeric value (e.g., 5 -> 5.0, 12.0633 -> 12.1)
    if (
      type === "number" &&
      inputValue !== "" &&
      typeof inputValue === "number"
    ) {
      inputValue = Number(inputValue).toFixed(1);
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
            decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
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
      // CRITICAL FIX: Prevent focus on readonly cells
      if (props.readOnly) {
        e.currentTarget.blur();
        return;
      }
      
      setIsFocused(true);
      updateTooltipPosition();
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setTooltipPosition(null);
      
      // Process and save the final value when user leaves the input
      // CRITICAL FIX: Only process changes for non-readonly cells
      if (hasContext && contextOnChange && !props.readOnly) {
        if (type === "number") {
          // Handle numeric input
          const raw = useThousandsFormatting
            ? localValue.replace(/,/g, "")
            : localValue;
          
          // Allow intermediate decimal input (e.g., "12." should be preserved)
          let newValue: number | string = raw;
          
          // Only parse as float if the input is a complete number or empty
          if (raw === "" || raw === "-") {
            // Treat cleared or single minus as empty
            newValue = "";
          } else if (/^-?\d+\.?\d*$/.test(raw)) {
            const parsed = parseFloat(raw);
            if (!isNaN(parsed)) {
              newValue = parsed;
            } else {
              // Keep the raw string for intermediate states like "12."
              newValue = raw;
            }
          }

          // Apply inverse transformation if provided (e.g., divide by 100 for percentages)
          if (inverseRenderValue && typeof newValue === "number") {
            newValue = inverseRenderValue(newValue);
          }

          // Avoid redundant save if value didn't change
          const previous = contextValue as unknown as string | number | undefined;
          const prevComparable = previous === undefined || previous === null ? "" : String(previous);
          const nextComparable = newValue === undefined || newValue === null ? "" : String(newValue);
          if (prevComparable !== nextComparable) {
            contextOnChange(sheet!, cell!, newValue);
          }
        } else {
          // Handle string/text input
          const previous = contextValue as unknown as string | number | undefined;
          const prevComparable = previous === undefined || previous === null ? "" : String(previous);
          const nextComparable = localValue === undefined || localValue === null ? "" : String(localValue);
          if (prevComparable !== nextComparable) {
            contextOnChange(sheet!, cell!, localValue);
          }
        }
      }
      
      // Clear local value after processing
      setLocalValue("");
      
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

    // Initialize local value when context value changes (but not when focused)
    React.useEffect(() => {
      if (!isFocused) {
        const currentValue = hasContext && contextValue !== undefined ? contextValue : value;
        if (currentValue !== undefined && currentValue !== null) {
          setLocalValue(String(currentValue));
        } else {
          setLocalValue("");
        }
      }
    }, [contextValue, value, hasContext, isFocused]);

    // Handle change event - only update local state, don't trigger context changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // CRITICAL FIX: Prevent changes to readonly cells
      if (props.readOnly) {
        e.preventDefault();
        return;
      }
      
      // Store the raw input value in local state
      setLocalValue(e.target.value);
      
      // Call onChange prop if provided (for non-context usage)
      if (!hasContext && onChange) {
        onChange(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow parent handlers to run first
      props.onKeyDown?.(e);
      if (e.defaultPrevented) return;

      // CRITICAL FIX: Prevent keyboard input on readonly cells (except navigation keys)
      if (props.readOnly) {
        // Allow only navigation keys (Enter, Arrow keys, Tab, Escape)
        const navigationKeys = ["Enter", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        if (!navigationKeys.includes(e.key)) {
          e.preventDefault();
          return;
        }
      }

      // Enter navigation: move focus to next input in same sheet (DOM order)
      if (e.key === "Enter") {
        e.preventDefault();
        const selector = sheet ? `input[data-sheet="${sheet}"]` : "input";
        const allInputs = Array.from(
          document.querySelectorAll<HTMLInputElement>(selector)
        ).filter((el) => !el.disabled && el.tabIndex !== -1 && !el.readOnly);
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
        return;
      }

      // Arrow key navigation with table/row awareness
      const isArrow =
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight";
      if (!isArrow) return;

      e.preventDefault();
      e.stopPropagation();

      const current = e.currentTarget as HTMLInputElement;

      const isFocusable = (el: HTMLInputElement) =>
        !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null && !el.readOnly;

      const focusAndSelect = (el: HTMLInputElement | null | undefined) => {
        if (!el) return;
        el.focus();
        try {
          el.select?.();
        } catch {}
      };

      const currentCell = current.closest("td,th");
      const currentRow = current.closest("tr");
      const currentTable = current.closest("table");

      // Helper: inputs within a row in DOM order
      const getRowInputs = (row: HTMLTableRowElement) =>
        Array.from(row.querySelectorAll<HTMLInputElement>("input"))
          .filter(isFocusable);

      // Helper: rows within a table in DOM order (prefer tbody rows)
      const getTableRows = (table: HTMLTableElement) => {
        const bodyRows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));
        if (bodyRows.length) return bodyRows;
        return Array.from(table.querySelectorAll<HTMLTableRowElement>("tr"));
      };

      // Helper: all focusable inputs inside a table
      const getTableInputs = (table: HTMLTableElement) =>
        Array.from(table.querySelectorAll<HTMLInputElement>("input"))
          .filter(isFocusable);

      // LEFT/RIGHT: stay strictly within the same row (no wrapping to other rows)
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!currentRow) return; // enforce row-only navigation
        const rowInputs = getRowInputs(currentRow);
        if (rowInputs.length) {
          const idx = rowInputs.indexOf(current);
          if (idx !== -1) {
            if (e.key === "ArrowRight") {
              if (idx + 1 < rowInputs.length) {
                focusAndSelect(rowInputs[idx + 1]);
                return;
              }
            } else {
              if (idx - 1 >= 0) {
                focusAndSelect(rowInputs[idx - 1]);
                return;
              }
              // At start of row: move to the last input of the previous table
              if (currentTable) {
                const tables = Array.from(document.querySelectorAll<HTMLTableElement>("table"));
                const idxTable = tables.indexOf(currentTable as HTMLTableElement);
                if (idxTable > 0) {
                  for (let t = idxTable - 1; t >= 0; t--) {
                    const prevTable = tables[t];
                    const inputs = Array.from(prevTable.querySelectorAll<HTMLInputElement>("input")).filter(isFocusable);
                    if (inputs.length) {
                      focusAndSelect(inputs[inputs.length - 1]);
                      return;
                    }
                  }
                }
              }
            }
          }
        }
        // If at row edge: allow ArrowRight to move to the first input of the next table
        if (e.key === "ArrowRight" && currentTable) {
          const tables = Array.from(document.querySelectorAll<HTMLTableElement>("table"));
          const idxTable = tables.indexOf(currentTable as HTMLTableElement);
          if (idxTable !== -1) {
            for (let t = idxTable + 1; t < tables.length; t++) {
              const nextTable = tables[t];
              const inputs = Array.from(nextTable.querySelectorAll<HTMLInputElement>("input")).filter(isFocusable);
              if (inputs.length) {
                focusAndSelect(inputs[0]);
                return;
              }
            }
          }
        }
        // Otherwise, no move if at row edge
        return;
      }

      // UP/DOWN: move to closest x-aligned input in previous/next row within the same table; then across tables if needed
      if ((e.key === "ArrowUp" || e.key === "ArrowDown") && currentRow && currentTable && currentCell) {
        const rows = getTableRows(currentTable);
        const rowIndex = rows.indexOf(currentRow as HTMLTableRowElement);
        const currentRect = currentCell.getBoundingClientRect();
        const targetX = currentRect.left + currentRect.width / 2;

        const pickClosestByX = (inputs: HTMLInputElement[]) => {
          if (inputs.length === 0) return null;
          let best: { el: HTMLInputElement; dx: number } | null = null;
          for (const el of inputs) {
            const cell = el.closest("td,th");
            if (!cell) continue;
            const r = cell.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const dx = Math.abs(cx - targetX);
            if (!best || dx < best.dx) best = { el, dx };
          }
          return best?.el || null;
        };

        if (rowIndex !== -1) {
          if (e.key === "ArrowDown") {
            for (let r = rowIndex + 1; r < rows.length; r++) {
              const inputs = getRowInputs(rows[r]);
              const candidate = pickClosestByX(inputs);
              if (candidate) {
                focusAndSelect(candidate);
                return;
              }
            }
          } else {
            for (let r = rowIndex - 1; r >= 0; r--) {
              const inputs = getRowInputs(rows[r]);
              const candidate = pickClosestByX(inputs);
              if (candidate) {
                focusAndSelect(candidate);
                return;
              }
            }
          }
        }

        // Across tables: find next table above/below and choose closest x
        const allTables = Array.from(document.querySelectorAll<HTMLTableElement>("table"));
        const tableRect = currentTable.getBoundingClientRect();
        const currentTableY = tableRect.top + tableRect.height / 2;
        type TableWithY = { t: HTMLTableElement; y: number };
        const tableCenters: TableWithY[] = allTables
          .filter((t) => t !== currentTable)
          .map((t) => {
            const r = t.getBoundingClientRect();
            return { t, y: r.top + r.height / 2 };
          });

        const candidatesOrdered = tableCenters
          .filter((it) => (e.key === "ArrowDown" ? it.y > currentTableY : it.y < currentTableY))
          .sort((a, b) => (e.key === "ArrowDown" ? a.y - b.y : b.y - a.y));

        for (const { t } of candidatesOrdered) {
          const inputs = getTableInputs(t);
          const candidate = pickClosestByX(inputs);
          if (candidate) {
            focusAndSelect(candidate);
            return;
          }
        }

        // Final fallback: move by global DOM order across all tables
        const allInTables = Array.from(document.querySelectorAll<HTMLInputElement>("table input")).filter(isFocusable);
        const globalIdx = allInTables.indexOf(current);
        if (globalIdx !== -1) {
          if (e.key === "ArrowDown") {
            focusAndSelect(allInTables[(globalIdx + 1) % allInTables.length]);
          } else {
            focusAndSelect(allInTables[(globalIdx - 1 + allInTables.length) % allInTables.length]);
          }
          return;
        }

        return;
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
          "absolute inset-0 w-full h-full box-border border-2 border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-700 read-only:bg-yellow-300 read-only:cursor-default",
          isInteractive && "focus:border-primary",
          !isInteractive && "focus:border-red-500 focus:border-2",
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

# HyperFormula Data Management System

This document describes the comprehensive data management system implemented using HyperFormula for spreadsheet-like calculations with automatic change tracking and bulk save functionality.

## Overview

The system provides:
- **Automatic formula calculation** using HyperFormula
- **Real-time recalculation** when cells change
- **Change tracking** to detect modified values
- **Bulk save** to send only changed values to the backend
- **Context-based access** for easy integration in sheet components

## Architecture

### Data Flow

```
Backend (MongoDB) → BackendData[]
    ↓ transformBe2Fe()
FrontendData (2D arrays by sheet)
    ↓ initializeHyperFormula()
HyperFormula Instance (with formulas)
    ↓ getCalculatedData()
React State (calculated values)
    ↓ useDataContext()
Sheet Components (display & edit)
```

### Key Components

1. **DashboardLayout** (`client/components/layout/dashboard-layout.tsx`)
   - Manages HyperFormula instance
   - Handles data fetching and transformation
   - Tracks changes and saves to backend
   - Provides DataContext to child components

2. **DataContext** (`client/lib/contexts/DataContext.tsx`)
   - Context provider for sharing data and functions
   - `useDataContext()` hook for accessing data in components

3. **Data Transformers** (`client/lib/transformers/dataTransformer.ts`)
   - `transformBe2Fe()`: Backend → Frontend format
   - `transformFe2Be()`: Frontend → Backend format

4. **Cell Helpers** (`client/lib/utils/cellHelpers.ts`)
   - Utility functions for cell reference conversion
   - Value formatting and parsing

## Data Structures

### BackendData (from server)

```typescript
interface BackendData {
  sheet: string;    // Sheet name (e.g., "start", "profit")
  cell: string;     // Cell reference (e.g., "B6", "C10")
  value: number;    // Numeric value
  formula: string;  // Formula string (e.g., "=SUM(B2:B5)")
}
```

### FrontendData (in React state)

```typescript
interface FrontendData {
  [sheetName: string]: (string | number)[][];
}

// Example:
{
  "start": [
    [],                    // Row 0 (empty)
    [null, null, 100],     // Row 1 (C1 = 100)
    [null, null, 200],     // Row 2 (C2 = 200)
    [null, null, "=C1+C2"] // Row 3 (C3 = formula)
  ]
}
```

## Usage in Sheet Components

### Basic Usage

```tsx
import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue } from "@/lib/utils/cellHelpers";

export default function MySheet() {
  const { data, onChange, onSave, saving, hasChanges } = useDataContext();
  
  // Get sheet data
  const sheetData = data["start"] || [];
  
  // Get cell value by reference
  const value = getCellValue(sheetData, "B6");
  
  // Update cell value
  const handleCellChange = (newValue: number) => {
    onChange("start", "B6", newValue);
  };
  
  // Save changes
  const handleSave = async () => {
    await onSave();
  };
  
  return (
    <div>
      <input 
        type="number" 
        value={value || 0}
        onChange={(e) => handleCellChange(Number(e.target.value))}
      />
      <button onClick={handleSave} disabled={!hasChanges || saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
```

### Advanced Example with Table

```tsx
import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue, cellToIndices } from "@/lib/utils/cellHelpers";

export default function DataTable() {
  const { data, onChange } = useDataContext();
  const sheetData = data["start"] || [];
  
  const cells = ["B6", "B7", "B8", "B9"];
  
  return (
    <table>
      <tbody>
        {cells.map((cellRef) => {
          const value = getCellValue(sheetData, cellRef);
          const { row, col } = cellToIndices(cellRef);
          
          return (
            <tr key={cellRef}>
              <td>{cellRef}</td>
              <td>
                <input
                  type="number"
                  value={value || 0}
                  onChange={(e) => 
                    onChange("start", cellRef, Number(e.target.value))
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
```

## Functions Reference

### useDataContext()

Hook to access data context in sheet components.

**Returns:**
```typescript
{
  data: FrontendData;           // All sheet data (2D arrays)
  onChange: (                   // Update cell value
    sheet: string,              // Sheet name
    cell: string,               // Cell reference (e.g., "B6")
    value: number               // New value
  ) => void;
  onSave: () => Promise<void>;  // Save changes to backend
  saving: boolean;              // True if save in progress
  hasChanges: boolean;          // True if there are unsaved changes
}
```

### handleChangeCell()

Updates a cell value and recalculates dependent formulas.

**Parameters:**
- `sheet` (string): Sheet name (e.g., "start")
- `cell` (string): Cell reference (e.g., "B6")
- `value` (number): New cell value

**Example:**
```typescript
onChange("start", "B6", 100);
```

**Note:** Cannot update cells that contain formulas - they are read-only.

### handleSave()

Saves all changed cells to the backend in bulk.

**Features:**
- Automatically detects changed values
- Only sends modified cells to backend
- Updates original data after successful save
- Preserves formulas (only saves user-input values)

**Example:**
```typescript
await onSave();
```

## Cell Helpers

### cellToIndices(cell)

Converts cell reference to array indices.

```typescript
cellToIndices("B6") // { row: 5, col: 1 }
```

### indicesToCell(row, col)

Converts array indices to cell reference.

```typescript
indicesToCell(5, 1) // "B6"
```

### getCellValue(data, cell)

Gets cell value from 2D array using cell reference.

```typescript
const value = getCellValue(sheetData, "B6");
```

### isFormula(value)

Checks if a cell contains a formula.

```typescript
isFormula("=SUM(A1:A5)") // true
isFormula(100)            // false
```

### formatCellValue(value, decimals)

Formats cell value for display.

```typescript
formatCellValue(1234.567, 2)  // "1,234.57"
formatCellValue(100, 0)        // "100"
```

### parseCellInput(input)

Parses user input to number or string.

```typescript
parseCellInput("1,234.56")  // 1234.56
parseCellInput("=A1+B1")    // "=A1+B1"
```

## How It Works

### 1. Initial Load

```typescript
// Fetch data from server
const backendData: BackendData[] = await userService.getUserInputs();

// Transform to frontend format
const frontendData = transformBe2Fe(backendData);

// Initialize HyperFormula with formulas
initializeHyperFormula(frontendData, backendData);

// Get calculated values
const calculatedData = getCalculatedData();

// Update state
setUserInput(calculatedData);
```

### 2. Cell Update

```typescript
// User changes cell B6 to 100
handleChangeCell("start", "B6", 100);

// Inside handleChangeCell:
// 1. Check if cell has formula (read-only)
// 2. Update cell in HyperFormula
hf.setCellContents({ sheet: sheetId, row, col }, [[100]]);

// 3. HyperFormula recalculates dependent formulas
// 4. Get updated data
const calculatedData = getCalculatedData();

// 5. Update state
setUserInput(calculatedData);
```

### 3. Save Changes

```typescript
// User clicks save button
await handleSave();

// Inside handleSave:
// 1. Compare current values with original data
const changedCells = getChangedCells();

// 2. Filter only user-input values (not formulas)
// 3. Send bulk update to backend
await userService.saveMultipleInputs(changedCells);

// 4. Update original data reference
originalDataRef.current = await userService.getUserInputs();
```

## Best Practices

### 1. Don't Edit Formula Cells

Formula cells are calculated automatically. Attempting to edit them will show a warning.

```typescript
// Bad - trying to edit a formula cell
onChange("start", "B10", 100); // If B10 has formula, this will warn

// Good - only edit input cells
onChange("start", "B6", 100);  // B6 is an input cell
```

### 2. Use getCellValue for Safety

Always use `getCellValue()` to safely access cell values.

```typescript
// Bad - might throw error if row/col doesn't exist
const value = data["start"][5][1];

// Good - returns undefined if not found
const value = getCellValue(data["start"], "B6");
```

### 3. Batch Changes

HyperFormula automatically recalculates after each change. For multiple updates, consider debouncing.

```typescript
// Multiple onChange calls will each trigger recalculation
onChange("start", "B6", 100);
onChange("start", "B7", 200);
onChange("start", "B8", 300);
```

### 4. Check hasChanges Before Save

Use `hasChanges` to determine if save button should be enabled.

```tsx
<button 
  onClick={onSave} 
  disabled={!hasChanges || saving}
>
  Save
</button>
```

## Troubleshooting

### Formula Not Calculating

**Problem:** Formula shows as string instead of calculated value.

**Solution:** Ensure formula starts with "=" and uses correct syntax.

```typescript
// Bad
"SUM(A1:A5)"

// Good
"=SUM(A1:A5)"
```

### Cell Value Not Updating

**Problem:** Cell value doesn't update after onChange.

**Solution:** Check if cell contains a formula (read-only).

```typescript
// Check in browser console
const serialized = hf.getCellSerialized({ sheet: 0, row: 5, col: 1 });
console.log(serialized); // If starts with "=", it's a formula
```

### Changes Not Saving

**Problem:** handleSave() doesn't send data to backend.

**Solution:** Check if getChangedCells() returns any changes.

```typescript
// Debug in component
console.log(getChangedCells());
```

### Type Errors

**Problem:** TypeScript errors when accessing cell values.

**Solution:** Use type guards or optional chaining.

```typescript
// Safe access
const value = data["start"]?.[row]?.[col] ?? 0;
```

## Performance Considerations

1. **HyperFormula is fast** - Can handle thousands of cells efficiently
2. **Recalculation is automatic** - No manual recalc needed
3. **Change tracking is O(n)** - Scales with number of cells
4. **Bulk save is efficient** - Only sends changed values

## Next Steps

1. Update individual sheet components to use `useDataContext()`
2. Replace hardcoded values with dynamic data from context
3. Implement cell editing UI with proper validation
4. Add loading states and error handling
5. Consider adding undo/redo functionality

## Example Sheet Component Migration

### Before (Static)

```tsx
export default function MySheet() {
  const [value, setValue] = useState(0);
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
    />
  );
}
```

### After (Dynamic with HyperFormula)

```tsx
import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue } from "@/lib/utils/cellHelpers";

export default function MySheet() {
  const { data, onChange } = useDataContext();
  const value = getCellValue(data["start"], "B6") || 0;
  
  return (
    <input 
      value={value}
      onChange={(e) => onChange("start", "B6", Number(e.target.value))}
    />
  );
}
```

## Additional Resources

- [HyperFormula Documentation](https://handsontable.github.io/hyperformula/)
- [Data Transformer Documentation](./client/lib/transformers/dataTransformer.ts)
- [Cell Helpers Documentation](./client/lib/utils/cellHelpers.ts)


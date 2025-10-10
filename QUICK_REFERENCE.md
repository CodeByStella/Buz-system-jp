# HyperFormula Data Management - Quick Reference

## 🚀 Get Started in 30 Seconds

### 1. Import the hook
```tsx
import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue } from "@/lib/utils/cellHelpers";
```

### 2. Use in your component
```tsx
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

## 📖 Common Patterns

### Get Cell Value
```tsx
const { data } = useDataContext();

// Method 1: Using helper (recommended)
const value = getCellValue(data["start"], "B6");

// Method 2: Direct access
const value = data["start"]?.[5]?.[1] ?? 0; // B6 = row 5, col 1
```

### Update Cell Value
```tsx
const { onChange } = useDataContext();

onChange("start", "B6", 100);  // Update B6 to 100
```

### Save Changes
```tsx
const { onSave, saving, hasChanges } = useDataContext();

<button onClick={onSave} disabled={!hasChanges || saving}>
  {saving ? "Saving..." : "Save"}
</button>
```

### Cell Array Access
```tsx
const cells = ["B6", "B7", "B8"];

{cells.map(cell => (
  <input
    key={cell}
    value={getCellValue(data["start"], cell) || 0}
    onChange={(e) => onChange("start", cell, Number(e.target.value))}
  />
))}
```

## 🎯 Cell Reference Guide

### Cell to Array Index
| Cell | Row (0-based) | Col (0-based) |
|------|---------------|---------------|
| A1   | 0             | 0             |
| B6   | 5             | 1             |
| C10  | 9             | 2             |
| AA1  | 0             | 26            |

### Conversion Functions
```tsx
import { cellToIndices, indicesToCell } from "@/lib/utils/cellHelpers";

cellToIndices("B6")    // { row: 5, col: 1 }
indicesToCell(5, 1)    // "B6"
```

## 🔧 Helper Functions

### Format Cell Value
```tsx
import { formatCellValue } from "@/lib/utils/cellHelpers";

formatCellValue(1234.56, 2)   // "1,234.56"
formatCellValue(100, 0)        // "100"
```

### Parse User Input
```tsx
import { parseCellInput } from "@/lib/utils/cellHelpers";

parseCellInput("1,234.56")  // 1234.56
parseCellInput("100")        // 100
```

### Check if Formula
```tsx
import { isFormula } from "@/lib/utils/cellHelpers";

isFormula("=SUM(A1:A5)")  // true
isFormula(100)            // false
```

## ⚡ Context API

```tsx
const {
  data,          // FrontendData - all sheets data
  onChange,      // Update cell value
  onSave,        // Save to backend
  saving,        // Boolean - save in progress
  hasChanges     // Boolean - unsaved changes exist
} = useDataContext();
```

## 🎨 Complete Component Example

```tsx
import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue, formatCellValue } from "@/lib/utils/cellHelpers";

export default function MySheet() {
  const { data, onChange, onSave, saving, hasChanges } = useDataContext();
  const sheetData = data["start"] || [];
  
  const cells = {
    input1: "B6",
    input2: "B7",
    total: "B10",  // Formula cell - read only
  };
  
  return (
    <div>
      <h1>My Sheet</h1>
      
      {/* Input cells */}
      <div>
        <label>Input 1:</label>
        <input
          type="number"
          value={getCellValue(sheetData, cells.input1) || 0}
          onChange={(e) => 
            onChange("start", cells.input1, Number(e.target.value))
          }
        />
      </div>
      
      <div>
        <label>Input 2:</label>
        <input
          type="number"
          value={getCellValue(sheetData, cells.input2) || 0}
          onChange={(e) => 
            onChange("start", cells.input2, Number(e.target.value))
          }
        />
      </div>
      
      {/* Calculated cell (read-only) */}
      <div>
        <label>Total:</label>
        <span>{formatCellValue(getCellValue(sheetData, cells.total))}</span>
      </div>
      
      {/* Save button */}
      <button 
        onClick={onSave} 
        disabled={!hasChanges || saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      
      {hasChanges && <span>⚠️ Unsaved changes</span>}
    </div>
  );
}
```

## 🚫 Common Mistakes

### ❌ Don't: Edit formula cells
```tsx
// Bad - formula cells are read-only
onChange("start", "B10", 100); // If B10 = "=SUM(...)"
```

### ❌ Don't: Access without null checks
```tsx
// Bad - might throw error
const value = data["start"][5][1];

// Good - safe access
const value = data["start"]?.[5]?.[1] ?? 0;
const value2 = getCellValue(data["start"], "B6");
```

### ❌ Don't: Parse strings as numbers
```tsx
// Bad - might be NaN
const value = Number(e.target.value);

// Good - use helper
import { parseCellInput } from "@/lib/utils/cellHelpers";
const value = parseCellInput(e.target.value);
```

## ✅ Best Practices

### ✓ Always use getCellValue()
```tsx
const value = getCellValue(sheetData, "B6");
```

### ✓ Define cell references as constants
```tsx
const CELLS = {
  REVENUE: "B6",
  COSTS: "B7",
  PROFIT: "B10"
} as const;

const revenue = getCellValue(data["start"], CELLS.REVENUE);
```

### ✓ Use type guards
```tsx
const value = getCellValue(sheetData, "B6");
const numValue = typeof value === "number" ? value : 0;
```

### ✓ Show loading states
```tsx
const { saving } = useDataContext();

<button disabled={saving}>
  {saving ? "Saving..." : "Save"}
</button>
```

## 📚 Documentation Links

- **Full Documentation**: `HYPERFORMULA_DATA_MANAGEMENT.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Example Component**: `client/components/sheets/example-sheet-usage.tsx`

## 🔗 Cheat Sheet URLs

- Cell Helpers: `client/lib/utils/cellHelpers.ts`
- Context API: `client/lib/contexts/DataContext.tsx`
- Data Transformers: `client/lib/transformers/dataTransformer.ts`
- User Service: `client/lib/services/userService.ts`

## 💡 Tips

1. **Formula cells are automatic** - Don't try to edit them
2. **Save is global** - There's a save button in the header
3. **Changes are tracked** - Only modified values are saved
4. **HyperFormula handles recalc** - No manual recalculation needed
5. **Use the example** - See `example-sheet-usage.tsx` for patterns

---

**Need Help?** Check the full documentation in `HYPERFORMULA_DATA_MANAGEMENT.md`


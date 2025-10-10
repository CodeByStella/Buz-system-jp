# Formula Preservation Fix

## Problem
Previously, when saving data, the application was:
1. Getting **calculated values** from HyperFormula (e.g., `=B1+C3` would become `123`)
2. Saving these calculated values back to the database
3. Overwriting the original formulas with plain numbers
4. Next time the data was loaded, formulas were gone and calculations wouldn't update

Additionally, string values (like "Total", "Sales") could potentially be confused with formulas.

## Solution

### 1. **Formula Identification**
- Added `isFormula()` helper function
- A value is a formula if it's a string that starts with `=`
- Regular strings (like "Total", "Sales", "100") are NOT formulas
- Numbers are NOT formulas

### 2. **Tracking Formula Cells**
- `formulaCellsRef`: Tracks cells that have formulas from the database
- When data is loaded, all cells with values starting with `=` are marked as formula cells
- Format: `"sheetName:cellRef"` (e.g., `"start:B5"`)

### 3. **Tracking User Edits**
- `userEditedCellsRef`: Tracks only cells that the user actually edited
- When a user edits a cell via `onChange()`, it's added to this set
- Formula cells from the database are NOT in this set (unless the user edits them)

### 4. **Smart Saving Logic**
The `getChangedCells()` function now:

1. **Only processes user-edited cells** (not all cells)
   - Skips formula cells that haven't been touched
   - Only saves what the user actually changed

2. **Preserves formulas**
   - Uses `getCellSerialized()` to get the raw cell content
   - If content starts with `=`, saves the formula string (e.g., `"=B1+C3"`)
   - If not, saves the calculated value (e.g., `123` or `"Total"`)

3. **Handles different value types**
   - **Formulas**: `"=B1+C3"` → Saved as `"=B1+C3"`
   - **Numbers**: `123` → Saved as `123`
   - **Strings**: `"Total"` → Saved as `"Total"`

### 5. **Post-Save Cleanup**
After successful save:
- Clear `userEditedCellsRef` (changes are now persisted)
- Reload formula cells from fresh database data
- This ensures consistency between frontend and backend

## Data Flow

### Loading Data
```
Database → Backend API → DataContext
  ↓
Identify formula cells (values starting with "=")
  ↓
Load into HyperFormula (formulas + values)
  ↓
Display calculated results in UI
```

### User Editing
```
User changes cell B5 = 100
  ↓
Add "start:B5" to userEditedCellsRef
  ↓
Update HyperFormula
  ↓
Recalculate and update UI
```

### Saving Data
```
Get user-edited cells only
  ↓
For each edited cell:
  - If it's a formula (starts with "=") → Save formula string
  - If it's a value → Save the value
  ↓
Send to backend
  ↓
Clear userEditedCellsRef
```

## Examples

### Example 1: Formula Cell
```
Database: { sheet: "start", cell: "B5", value: "=B1+B2" }

On Load:
- formulaCellsRef includes "start:B5"
- HyperFormula displays calculated result (e.g., 150)
- User sees 150 in the UI

On Save (if B5 NOT edited):
- "start:B5" NOT in userEditedCellsRef
- Cell is skipped
- Formula "=B1+B2" remains in database ✓

On Save (if user edits B5 to "=B1+B3"):
- "start:B5" IS in userEditedCellsRef
- getCellSerialized() returns "=B1+B3"
- Save "=B1+B3" to database ✓
```

### Example 2: String Value
```
Database: { sheet: "start", cell: "A1", value: "Total Sales" }

On Load:
- NOT a formula (doesn't start with "=")
- HyperFormula treats it as string
- User sees "Total Sales"

If user edits A1 to "Grand Total":
- Save "Grand Total" to database ✓
```

### Example 3: Number Value
```
Database: { sheet: "start", cell: "C1", value: 1000 }

On Load:
- NOT a formula
- HyperFormula treats it as number
- User sees 1000

If user edits C1 to 2000:
- Save 2000 to database ✓

If user edits C1 to "=B1*2":
- Now it's a formula!
- Save "=B1*2" to database ✓
```

## Key Benefits

1. ✅ **Formulas are preserved** - Never overwritten with calculated values
2. ✅ **Only user changes are saved** - Formula cells untouched by user are skipped
3. ✅ **Strings handled correctly** - Regular text vs formulas properly distinguished
4. ✅ **Numbers handled correctly** - Numeric values saved as numbers
5. ✅ **Dynamic formula editing** - Users can add/edit/remove formulas freely
6. ✅ **Performance** - Only processes edited cells, not entire spreadsheet

## Technical Details

### Key Functions
- `isFormula(value)` - Check if value is a formula (starts with "=")
- `fetchUserInputs()` - Populate formulaCellsRef on load
- `handleChangeCell()` - Track user edits
- `getChangedCells()` - Smart save logic
- `handleSave()` - Clear tracking after save

### HyperFormula Methods Used
- `getCellValue()` - Get calculated result (for display)
- `getCellSerialized()` - Get raw formula or value (for saving)
- `setCellContents()` - Set cell formula or value

## Migration Notes

No database migration needed! The existing schema supports both formulas and values in the `value` field. This fix only changes the **client-side logic** for saving data.


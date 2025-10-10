# Formula Preservation - Test Guide

## Quick Test Scenarios

### Test 1: Formula Cell Should NOT Be Saved If Not Edited

**Setup:**
1. Add a formula to database: `{ sheet: "start", cell: "B5", value: "=B1+B2" }`
2. Add values: `{ sheet: "start", cell: "B1", value: 10 }`, `{ sheet: "start", cell: "B2", value: 20 }`

**Steps:**
1. Load the page
2. You should see B5 displays `30` (calculated result)
3. Edit a different cell (e.g., B1 to 15)
4. Click Save

**Expected Result:**
- Only B1 is saved with value `15`
- B5 is NOT saved (formula remains `=B1+B2` in database)
- After refresh, B5 shows `35` (15 + 20)

**Console Check:**
```
Loaded 1 formula cells from database
Identified formula cell: start:B5 = =B1+B2
Saving 1 changed cells: [{ sheet: "start", cell: "B1", value: 15 }]
```

---

### Test 2: Formula Cell Should Be Saved If User Edits It

**Setup:**
1. Database has: `{ sheet: "start", cell: "B5", value: "=B1+B2" }`

**Steps:**
1. Load the page
2. Edit B5 to a new formula: `=B1*2`
3. Click Save

**Expected Result:**
- B5 is saved with value `=B1*2` (formula string, not calculated value)
- After refresh, B5 correctly calculates based on new formula

**Console Check:**
```
User entered formula in start:B5: =B1*2
Saving 1 changed cells: [{ sheet: "start", cell: "B5", value: "=B1*2" }]
```

---

### Test 3: Regular String Values Should Work

**Setup:**
1. Empty database

**Steps:**
1. Edit A1 to "Total Sales"
2. Edit A2 to "Quantity"
3. Click Save

**Expected Result:**
- A1 saved as `"Total Sales"` (string)
- A2 saved as `"Quantity"` (string)
- NOT mistaken for formulas

**Console Check:**
```
Saving 2 changed cells: 
[
  { sheet: "start", cell: "A1", value: "Total Sales" },
  { sheet: "start", cell: "A2", value: "Quantity" }
]
```

---

### Test 4: Number Values Should Work

**Setup:**
1. Empty database

**Steps:**
1. Edit C1 to `1000`
2. Edit C2 to `500.5`
3. Click Save

**Expected Result:**
- C1 saved as `1000` (number)
- C2 saved as `500.5` (number)

**Console Check:**
```
Saving 2 changed cells: 
[
  { sheet: "start", cell: "C1", value: 1000 },
  { sheet: "start", cell: "C2", value: 500.5 }
]
```

---

### Test 5: User Clears a Cell

**Setup:**
1. Database has: `{ sheet: "start", cell: "B1", value: 100 }`

**Steps:**
1. Load the page
2. Edit B1 to empty (clear it)
3. Click Save

**Expected Result:**
- B1 saved as `""` (empty string)
- Database entry removed or set to empty

**Console Check:**
```
Saving 1 changed cells: [{ sheet: "start", cell: "B1", value: "" }]
```

---

### Test 6: User Replaces Formula with Value

**Setup:**
1. Database has: `{ sheet: "start", cell: "B5", value: "=B1+B2" }`

**Steps:**
1. Load the page (B5 shows calculated result, e.g., 30)
2. Edit B5 to a plain number: `999`
3. Click Save

**Expected Result:**
- B5 saved as `999` (number, not formula)
- Formula cell tracking removed for B5
- After refresh, B5 shows `999` (static value)

**Console Check:**
```
User replaced formula in start:B5 with value: 999
Saving 1 changed cells: [{ sheet: "start", cell: "B5", value: 999 }]
```

---

### Test 7: Multiple Edits Mixed Types

**Setup:**
1. Database has:
   - `{ sheet: "start", cell: "A1", value: "Sales" }`
   - `{ sheet: "start", cell: "B1", value: 100 }`
   - `{ sheet: "start", cell: "C1", value: "=B1*2" }`

**Steps:**
1. Load the page
2. Edit A1 to "Total Sales" (change string)
3. Edit B1 to 200 (change number)
4. Don't touch C1 (leave formula alone)
5. Edit D1 to "=B1+50" (new formula)
6. Click Save

**Expected Result:**
- A1 saved as `"Total Sales"`
- B1 saved as `200`
- C1 NOT saved (formula preserved in database)
- D1 saved as `"=B1+50"`
- After refresh, C1 shows `400` (200*2), D1 shows `250` (200+50)

**Console Check:**
```
Saving 3 changed cells: 
[
  { sheet: "start", cell: "A1", value: "Total Sales" },
  { sheet: "start", cell: "B1", value: 200 },
  { sheet: "start", cell: "D1", value: "=B1+50" }
]
```

---

## Database Verification

After each test, check MongoDB directly:

```javascript
// In MongoDB Compass or shell
db.data.find({ sheet: "start" })
```

**What to look for:**
- Formula cells should have `value: "=..."` (string starting with =)
- Number cells should have `value: 123` (number type)
- String cells should have `value: "text"` (string NOT starting with =)

---

## Common Issues to Check

### ❌ Bug: Formula Overwritten
**Symptom:** After save, formula becomes a number in database
**Check:** 
```javascript
// Before save
{ sheet: "start", cell: "B5", value: "=B1+B2" }

// After save (BUG)
{ sheet: "start", cell: "B5", value: 30 }  // ❌ WRONG!
```

**Expected:**
```javascript
// After save (CORRECT)
{ sheet: "start", cell: "B5", value: "=B1+B2" }  // ✅ CORRECT!
```

### ❌ Bug: String Mistaken for Formula
**Symptom:** String value treated as formula
**Check:**
```javascript
// User enters: "Total"
// Saved as: "Total"  // ✅ CORRECT
// NOT saved as: formula  // ❌ WRONG
```

### ❌ Bug: All Cells Saved (Not Just Edited)
**Symptom:** Hundreds of cells saved when user only edited 1
**Check Console:**
```
Saving 200 changed cells  // ❌ WRONG
Saving 1 changed cells    // ✅ CORRECT
```

---

## Success Criteria

✅ Formulas are preserved after save
✅ Only user-edited cells are saved
✅ Regular strings work correctly
✅ Numbers work correctly  
✅ User can clear cells
✅ User can replace formulas with values
✅ User can replace values with formulas
✅ Mixed edits work correctly
✅ No console errors
✅ Database contains correct value types

---

## Debugging Tips

### Enable Detailed Logging
Check browser console for these logs:
- `Loaded X formula cells from database`
- `Identified formula cell: sheet:cell = formula`
- `User entered formula in...`
- `User replaced formula in...`
- `Saving X changed cells: [...]`

### Check Refs in DevTools
Add this to test (in browser console):
```javascript
// Check formula cells
console.log('Formula cells:', window.formulaCellsRef)

// Check user edits
console.log('User edited cells:', window.userEditedCellsRef)
```

### Verify HyperFormula State
```javascript
// Get raw formula
hf.getCellSerialized({ sheet: 0, row: 4, col: 1 })  // Returns "=B1+B2"

// Get calculated value
hf.getCellValue({ sheet: 0, row: 4, col: 1 })  // Returns 30
```

---

## Quick Smoke Test

1. Add formula to DB: `{ sheet: "start", cell: "B5", value: "=B1+B2" }`
2. Add values: B1=10, B2=20
3. Load page → See B5=30 ✅
4. Edit B1 to 15 and save
5. Check DB → B5 still has `"=B1+B2"` ✅
6. Refresh page → See B5=35 ✅
7. **If all pass → FIX IS WORKING! 🎉**


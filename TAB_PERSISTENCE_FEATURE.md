# Tab Persistence Feature

## Overview
The dashboard now remembers the last visited tab using browser localStorage. When you reload the page or come back later, it will automatically open the tab you were last viewing.

## Implementation

### Files Modified
- `client/components/layout/dashboard-layout.tsx`

### How It Works

1. **On Initial Load**
   - Checks localStorage for `lastVisitedTab` key
   - Validates the saved tab is a valid tab name
   - Restores the last visited tab or defaults to "start"

2. **On Tab Change**
   - Automatically saves the current tab to localStorage
   - Updates every time user switches tabs

3. **Validation**
   - Only valid tab names are restored from localStorage
   - If invalid tab is saved, defaults to "start"
   - Prevents errors from outdated/corrupted localStorage data

### Valid Tabs List
```typescript
const VALID_TABS = [
  "start",
  "mq-current",
  "profit",
  "mq-future",
  "salary",
  "expenses",
  "manufacturing-labor",
  "manufacturing-expenses",
  "cost-details",
  "breakeven",
  "progress",
  "sales-plan",
  "profit-plan"
]
```

## Usage

The feature works automatically with no user action required:

1. **First Visit**
   ```
   User visits dashboard → Opens "start" tab (default)
   ```

2. **Navigate to Different Tab**
   ```
   User clicks "Profit" tab → Switches to profit sheet
   → Saves "profit" to localStorage
   ```

3. **Reload Page**
   ```
   User refreshes browser → Opens "profit" tab automatically ✅
   ```

4. **Come Back Later**
   ```
   User closes browser and returns next day 
   → Opens "profit" tab (last visited) ✅
   ```

## LocalStorage Key
- **Key**: `lastVisitedTab`
- **Value**: Tab name string (e.g., `"profit"`, `"start"`)
- **Scope**: Per browser/device (not synced across devices)

## Console Logs

The feature logs for debugging:

```javascript
// On restore
"Restored last visited tab: profit"

// On save
"Saved last visited tab: profit"
```

## Example Flow

```
Timeline:
┌─────────────────────────────────────────────────────┐
│ Day 1, 10:00 AM                                     │
│ User visits dashboard → Opens "start" tab           │
│ localStorage: { lastVisitedTab: "start" }           │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ Day 1, 10:05 AM                                     │
│ User clicks "Profit" → Switches to profit sheet     │
│ localStorage: { lastVisitedTab: "profit" } ✅       │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ Day 1, 10:15 AM                                     │
│ User refreshes page → Opens "profit" tab ✅         │
│ localStorage: { lastVisitedTab: "profit" }          │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ Day 1, 2:00 PM                                      │
│ User clicks "Sales Plan" → Switches to sales plan  │
│ localStorage: { lastVisitedTab: "sales-plan" } ✅   │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ Day 2, 9:00 AM                                      │
│ User visits dashboard → Opens "sales-plan" tab ✅   │
│ localStorage: { lastVisitedTab: "sales-plan" }      │
└─────────────────────────────────────────────────────┘
```

## Browser Compatibility

Works in all modern browsers that support localStorage:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Note**: localStorage is per-domain and per-browser. Different browsers or incognito mode will have separate storage.

## Edge Cases Handled

### 1. Invalid Tab Name in localStorage
```javascript
// If someone manually edits localStorage to invalid value
localStorage.setItem('lastVisitedTab', 'invalid-tab')

// Result: Defaults to "start" ✅
```

### 2. localStorage Disabled/Blocked
```javascript
// If localStorage is blocked by browser settings
// Result: Defaults to "start" (no error) ✅
```

### 3. Server-Side Rendering
```javascript
// Checks `typeof window !== 'undefined'` before accessing localStorage
// Prevents SSR errors in Next.js ✅
```

### 4. Empty/Null Values
```javascript
// If localStorage returns null or empty string
// Result: Defaults to "start" ✅
```

## Testing

### Manual Testing

1. **Test Tab Persistence**
   ```
   1. Open dashboard
   2. Click on "Profit" tab
   3. Refresh page (F5)
   4. Should open "Profit" tab ✅
   ```

2. **Test Invalid Tab Handling**
   ```
   1. Open browser DevTools → Application → Local Storage
   2. Set lastVisitedTab to "invalid-name"
   3. Refresh page
   4. Should default to "start" tab ✅
   ```

3. **Test Different Tabs**
   ```
   1. Visit each tab in sequence
   2. Refresh after each
   3. Each time should restore the correct tab ✅
   ```

### Clear localStorage (for testing)
```javascript
// In browser console
localStorage.removeItem('lastVisitedTab')
// or
localStorage.clear()
```

### Check Current Value
```javascript
// In browser console
localStorage.getItem('lastVisitedTab')
// Returns: "profit" (or current tab)
```

## Future Enhancements

Potential improvements:
- [ ] Remember scroll position within each tab
- [ ] Save multiple tab history (back/forward navigation)
- [ ] Sync across devices using backend storage
- [ ] Clear tab history on logout
- [ ] Remember last visited tab per user (multi-user support)

## Notes

- Tab persistence is client-side only (no backend involved)
- Each user's tab preference is stored locally
- Clearing browser data will reset to "start" tab
- Private/incognito mode has separate localStorage


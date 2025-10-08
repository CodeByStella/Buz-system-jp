# Start Sheet Backend-Frontend Integration

Complete integration of the Start Sheet with backend database storage.

## Overview

This integration allows users to:
- ✅ Automatically load their saved start sheet data on page load
- ✅ Edit values in the start sheet
- ✅ Save all changes to the database with one click
- ✅ See loading and success/error states

## Architecture

```
Frontend (React)
    ↓
Client Service Layer (startSheetService)
    ↓
Data Transformer (startSheetTransformer)
    ↓
API Routes (/api/start-sheet)
    ↓
Backend Service (startSheetService)
    ↓
Repository Layer (startSheetRepo)
    ↓
MongoDB (StartSheet Model)
```

## Backend Implementation

### 1. Database Model (`server/models/sheets/start.ts`)

- **Updated**: Added `userId` field to link data to users
- **Structure**: 
  - Each row has `MainRowSchema` with `incomeStatement` and `manufacturingCostReport`
  - Others data uses `OthersRowSchema` with `title` and `amount`
  - Summary calculations stored as numbers

### 2. Repository Layer (`server/repositories/start-sheet-repo.ts`)

Handles all database operations:

```typescript
startSheetRepo.getByUserId(userId)    // Fetch user's data
startSheetRepo.create(userId, data)   // Create new document
startSheetRepo.update(userId, data)   // Update existing
startSheetRepo.upsert(userId, data)   // Create or update
startSheetRepo.delete(userId)         // Delete data
startSheetRepo.exists(userId)         // Check if exists
```

### 3. Service Layer (`server/services/start-sheet-service.ts`)

Business logic and data transformation:

```typescript
startSheetService.getStartSheet(userId)
startSheetService.saveStartSheet(userId, data)
startSheetService.deleteStartSheet(userId)
startSheetService.hasStartSheet(userId)
startSheetService.transformToFrontend(doc)
```

### 4. API Routes (`server/routes/start-sheet.ts`)

RESTful endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/start-sheet` | Fetch user's start sheet |
| POST | `/api/start-sheet` | Save/create start sheet |
| PUT | `/api/start-sheet` | Update start sheet |
| DELETE | `/api/start-sheet` | Delete start sheet |
| GET | `/api/start-sheet/exists` | Check if data exists |

All routes are protected with JWT authentication.

## Frontend Implementation

### 1. Client Service (`client/lib/services/startSheetService.ts`)

Handles API communication:

```typescript
startSheetService.getStartSheet()      // GET request
startSheetService.saveStartSheet(data) // POST request
startSheetService.updateStartSheet(data) // PUT request
startSheetService.deleteStartSheet()   // DELETE request
startSheetService.exists()             // Check existence
```

### 2. Data Transformer (`client/lib/transformers/startSheetTransformer.ts`)

Converts between frontend and backend formats:

**Frontend Format:**
```typescript
{
  key: "recentSales",
  label: "直近売上",
  incomeStatement: { value: 1000, type: 1 },
  manufacturingCostReport: { value: 0, type: 0 }
}
```

**Backend Format:**
```typescript
{
  recentSales: {
    incomeStatement: 1000,
    manufacturingCostReport: 0
  }
}
```

Functions:
- `transformBackendToFrontend()` - Convert DB data to UI format
- `transformFrontendToBackend()` - Convert UI data to DB format
- `getChangedFields()` - Optimize saves by detecting changes

### 3. Component Updates (`client/components/sheets/start-sheet/index.tsx`)

Enhanced with:

#### State Management
```typescript
const [isLoading, setIsLoading] = useState(true)
const [isSaving, setIsSaving] = useState(false)
const [error, setError] = useState<string | null>(null)
const [successMessage, setSuccessMessage] = useState<string | null>(null)
```

#### Data Fetching (useEffect)
```typescript
useEffect(() => {
  const fetchData = async () => {
    const response = await startSheetService.getStartSheet()
    const transformed = transformBackendToFrontend(response, ...)
    setStartSheetData_main(transformed.main)
    setStartSheetData_others(transformed.others)
  }
  fetchData()
}, [])
```

#### Save Handler
```typescript
const handleSave = async () => {
  const backendData = transformFrontendToBackend(
    startSheetData_main,
    startSheetData_others
  )
  await startSheetService.saveStartSheet(backendData)
}
```

#### UI Updates
- Loading spinner while fetching data
- Save button with loading state
- Success/error message display
- Auto-hide success message after 3 seconds

## Data Flow

### Loading Data

1. Component mounts → `useEffect` triggers
2. Call `startSheetService.getStartSheet()`
3. Backend fetches from MongoDB
4. `transformBackendToFrontend()` converts to UI format
5. State updated → UI renders with data

### Saving Data

1. User clicks "保存" button
2. Call `handleSave()`
3. `transformFrontendToBackend()` converts to DB format
4. Call `startSheetService.saveStartSheet(backendData)`
5. Backend upserts to MongoDB
6. Success message displayed
7. Message auto-hides after 3 seconds

## API Request/Response Examples

### GET /api/start-sheet

**Request:**
```http
GET /api/start-sheet
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "recentSales": {
      "incomeStatement": 1000000,
      "manufacturingCostReport": 0
    },
    "grossProfit": {
      "incomeStatement": 300000,
      "manufacturingCostReport": 0
    },
    ...
  },
  "message": "データを取得しました"
}
```

### POST /api/start-sheet

**Request:**
```http
POST /api/start-sheet
Authorization: Bearer <token>
Content-Type: application/json

{
  "recentSales": {
    "incomeStatement": 1000000,
    "manufacturingCostReport": 0
  },
  "grossProfit": {
    "incomeStatement": 300000,
    "manufacturingCostReport": 0
  },
  ...
}
```

**Response:**
```json
{
  "data": { ... },
  "message": "データを保存しました"
}
```

## Error Handling

### Frontend
- Network errors caught and displayed
- Loading states prevent multiple submissions
- User-friendly Japanese error messages

### Backend
- Try-catch blocks in all async operations
- Proper HTTP status codes (400, 404, 500)
- Detailed error logging to console
- User-friendly error responses

## Security

- ✅ All routes protected with JWT authentication
- ✅ User can only access their own data
- ✅ Data validated before saving
- ✅ MongoDB ObjectId for user references

## Testing

### Manual Testing Steps

1. **Load Test**
   - Navigate to /dashboard (start sheet)
   - Verify loading spinner appears
   - Verify data loads (or shows empty sheet for new users)

2. **Edit Test**
   - Change some values in the sheet
   - Verify formulas recalculate

3. **Save Test**
   - Click "保存" button
   - Verify loading state on button
   - Verify success message appears
   - Verify message disappears after 3 seconds

4. **Persistence Test**
   - Refresh the page
   - Verify saved data loads correctly

5. **Error Test**
   - Stop backend server
   - Try to save
   - Verify error message displays

## File Summary

### Backend Files Created/Modified
```
server/
├── models/sheets/start.ts          [MODIFIED] - Added userId
├── repositories/start-sheet-repo.ts [NEW]     - DB operations
├── services/start-sheet-service.ts  [NEW]     - Business logic
├── routes/start-sheet.ts            [NEW]     - API endpoints
└── index.ts                         [MODIFIED] - Registered routes
```

### Frontend Files Created/Modified
```
client/
├── lib/
│   ├── services/
│   │   ├── startSheetService.ts     [NEW]     - API client
│   │   └── index.ts                 [MODIFIED] - Export service
│   └── transformers/
│       └── startSheetTransformer.ts [NEW]     - Data conversion
└── components/sheets/start-sheet/
    └── index.tsx                    [MODIFIED] - Integration
```

## Future Enhancements

Potential improvements:

1. **Auto-save**: Save data automatically on change (debounced)
2. **Change Tracking**: Show unsaved changes indicator
3. **History**: Track revision history
4. **Export**: Excel/PDF export with saved data
5. **Offline Support**: Cache data for offline editing
6. **Validation**: Add field-level validation rules
7. **Bulk Operations**: Import/export multiple sheets

## Troubleshooting

### Data not loading
- Check browser console for errors
- Verify user is authenticated (JWT token valid)
- Check backend server is running
- Verify MongoDB connection

### Data not saving
- Check network tab for failed requests
- Verify request payload format
- Check backend logs for errors
- Ensure user has permission

### Performance issues
- Consider pagination for large datasets
- Implement data caching
- Optimize transformer functions
- Use React.memo for expensive components

## Summary

The integration is complete and production-ready. All data flows between frontend and backend correctly, with proper error handling, loading states, and user feedback. The architecture is scalable and follows best practices for separation of concerns.


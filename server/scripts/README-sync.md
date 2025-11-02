# Database Sync System

This system provides automated synchronization between the `sheets.ts` definitions and the MongoDB database. When you update `sheets.ts`, you can use these tools to update all database records accordingly.

## Features

- **Automatic Sync**: Updates existing records with new formulas/values from `sheets.ts`
- **Smart Detection**: Only updates records that have actually changed
- **User-Specific Sync**: Sync specific users or all users
- **Orphaned Record Management**: Option to remove records no longer in `sheets.ts`
- **API Integration**: Trigger syncs from the admin interface
- **Command Line Interface**: Run syncs from terminal

## Usage

### Command Line Interface

#### Full Database Sync (`db:sync`)
Syncs all values from `sheets.ts` to the database:

```bash
# Basic sync (keeps orphaned records)
npm run db:sync

# Sync and remove orphaned records
npm run db:sync -- --remove-orphaned

# Force update all records (even unchanged ones)
npm run db:sync -- --force-update

# Sync specific user
npm run db:sync -- --user user123

# Combine options
npm run db:sync -- --remove-orphaned --force-update --user user123

# Show help
npm run db:sync -- --help
```

#### Formula-Only Sync (`db:formula`)
Syncs only formulas (values starting with "="), ignores non-formula values:

```bash
# Basic formula sync (keeps orphaned formulas)
npm run db:formula

# Sync formulas and remove orphaned formulas
npm run db:formula -- --remove-orphaned

# Force update all formulas (even unchanged ones)
npm run db:formula -- --force-update

# Sync formulas for specific user
npm run db:formula -- --user user123

# Combine options
npm run db:formula -- --remove-orphaned --force-update --user user123

# Show help
npm run db:formula -- --help
```

### API Endpoints

#### POST `/api/sync/sync`

Trigger a database sync via API.

**Request Body:**
```json
{
  "removeOrphaned": false,    // Remove records not in sheets.ts
  "forceUpdate": false,       // Force update all records
  "userId": "user123"         // Optional: sync specific user
}
```

**Response:**
```json
{
  "message": "Database sync started",
  "options": {
    "removeOrphaned": false,
    "forceUpdate": false,
    "userId": "user123"
  }
}
```

#### GET `/api/sync/status`

Get sync status (placeholder for future implementation).

### Admin Interface

Access the database sync interface at `/admin` (admin users only). The interface provides:

- Checkbox options for sync behavior
- User ID input for targeted syncs
- One-click sync initiation
- Important warnings and notes

## How It Works

### Full Sync (`db:sync`)
1. **Read sheets.ts**: Loads all sheet definitions and values (formulas and non-formulas)
2. **Compare with Database**: Checks existing records against expected data
3. **Generate Operations**: Creates insert/update/delete operations as needed
4. **Bulk Execute**: Performs all operations efficiently using MongoDB bulkWrite
5. **Report Results**: Shows detailed list of changes made

### Formula Sync (`db:formula`)
1. **Read sheets.ts**: Loads only formulas (values starting with "=")
2. **Compare with Database**: Checks existing formula records against expected formulas
3. **Generate Operations**: Creates insert/update/delete operations only for formulas
4. **Bulk Execute**: Performs all operations efficiently using MongoDB bulkWrite
5. **Report Results**: Shows detailed list of formula changes made
6. **Non-formula values are ignored**: Only formulas are synced

## Sync Options Explained

### `removeOrphaned`
- **false** (default): Keep records that are no longer in `sheets.ts`
- **true**: Delete records that are no longer in `sheets.ts`

### `forceUpdate`
- **false** (default): Only update records that have changed
- **true**: Update all records, even if they haven't changed

### `userId`
- **undefined**: Sync all users (admin only)
- **"user123"**: Sync only the specified user

## Examples

### Scenario 1: Adding New Formulas
You add new formulas to `sheets.ts`:
```typescript
export const sheetsData = {
  start: {
    C7: "=C6-G102",
    C8: '=IFERROR(C7/C6,"")',
    // ... existing formulas
    C999: "=SUM(C1:C998)", // NEW FORMULA
  }
}
```

Run: `npm run db:sync`
- Adds the new formula to all users
- Updates existing formulas if they changed
- Keeps all existing data

### Scenario 2: Removing Formulas
You remove formulas from `sheets.ts`:

Run: `npm run db:sync -- --remove-orphaned`
- Removes the deleted formulas from all users
- Updates changed formulas
- Adds new formulas

### Scenario 3: Force Update All
You want to ensure all formulas are exactly as defined in `sheets.ts`:

Run: `npm run db:sync -- --force-update`
- Updates ALL records, even if they haven't changed
- Useful for fixing corrupted data or ensuring consistency

### Scenario 4: User-Specific Sync
You want to sync only one user:

Run: `npm run db:sync -- --user user123`
- Only affects the specified user
- Useful for testing or fixing individual user data

## Best Practices

1. **Test First**: Always test sync options on a single user first
2. **Backup**: Consider backing up your database before major syncs
3. **Monitor Logs**: Check server logs for sync progress and errors
4. **Incremental Updates**: Use basic sync for most updates
5. **Cleanup Periodically**: Use `--remove-orphaned` occasionally to clean up

## Troubleshooting

### Sync Hangs
- Check MongoDB connection
- Verify `sheets.ts` syntax is correct
- Check server logs for errors

### Permission Errors
- Ensure you're logged in as admin for full sync
- Use `userId` parameter for user-specific syncs

### Data Loss Concerns
- Use `--remove-orphaned` carefully
- Test with `--user` parameter first
- Keep backups of important data

## File Structure

```
server/
├── scripts/
│   ├── sync-database.ts      # Main sync logic (all values)
│   ├── sync-formulas.ts      # Formula sync only (formulas starting with "=")
│   └── sheets.ts            # Sheet definitions
├── routes/
│   └── sync.ts              # API endpoints
└── package.json            # Script definitions

client/
└── components/
    └── admin/
        └── database-sync.tsx # Admin interface
```

## Development

To extend the sync system:

1. **Add New Options**: Modify `SyncOptions` interface in `sync-database.ts`
2. **Custom Logic**: Add custom sync logic in the main sync function
3. **New Endpoints**: Add routes in `routes/sync.ts`
4. **UI Updates**: Modify `database-sync.tsx` for new options

## Security Notes

- Sync operations are logged for audit trails
- Admin authentication required for full syncs
- User-specific syncs available for non-admin users
- All operations are performed with proper error handling

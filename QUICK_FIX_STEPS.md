# 🚨 QUICK FIX: Cookie Authentication Not Working

## What Changed (Deploy These Files!)

1. ✅ `server/index.ts` - Added `trust proxy` (critical!)
2. ✅ `server/routes/auth.ts` - Changed cookie `sameSite` to `'none'` in production
3. ✅ Added diagnostic endpoint: `/api/config-check`

---

## 🎯 DO THIS RIGHT NOW

### Step 1: Deploy the Updated Code

```bash
# Pull the latest changes (if using git)
git pull

# Or manually copy these updated files to your server:
# - server/index.ts
# - server/routes/auth.ts
```

### Step 2: Set Environment Variables on Production Server

**Critical:** You MUST set `NODE_ENV=production` on your production server!

Choose your method:

#### Method A: Create `.env` file on server
```bash
# SSH into your server
ssh user@business.loveswap.io

# Navigate to server directory
cd /path/to/project/server

# Create/edit .env
nano .env
```

Add these lines:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://your-db-connection
PORT=3001
```

Save and exit (Ctrl+X, then Y, then Enter)

#### Method B: Set in Hosting Platform Dashboard

If using Heroku, Railway, Render, DigitalOcean App Platform, etc.:

1. Go to your project settings
2. Find "Environment Variables" section
3. Add:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-frontend-domain.com`
   - `JWT_SECRET` = (your secret)
   - `MONGODB_URI` = (your connection string)

### Step 3: Restart Your Backend Server

```bash
# PM2
pm2 restart all

# Or Docker
docker-compose restart

# Or manual
# Stop the current process and start again
npm start
```

**IMPORTANT:** Environment variables only load on startup!

### Step 4: Verify Configuration

Visit this URL in your browser:
```
https://business.loveswap.io/api/config-check
```

**You should see:**
```json
{
  "nodeEnv": "production",          // ❗ MUST be "production"
  "isProduction": true,              // ❗ MUST be true
  "frontendUrl": "https://...",      // ❗ MUST be your frontend URL
  "hasJwtSecret": true,              // ❗ MUST be true
  "hasMongoDB": true,                // ❗ MUST be true
  "protocol": "https",               // ❗ MUST be "https"
  "secure": true,                    // ❗ MUST be true
  "trustProxy": 1,                   // ❗ MUST be 1 or true
  "cookieSettings": {
    "sameSite": "none",              // ❗ MUST be "none" (not "lax")
    "secure": true,                  // ❗ MUST be true
    "httpOnly": true,
    "path": "/"
  }
}
```

❌ **If you see ANY of these, it's NOT configured correctly:**
- `"nodeEnv": "development"` or `undefined`
- `"isProduction": false`
- `"sameSite": "lax"`
- `"secure": false`
- `"protocol": "http"`
- `"frontendUrl": "http://localhost:3000"`

### Step 5: Test Login

1. Open your frontend
2. Try to login
3. Open browser DevTools → Network tab
4. Check the login response headers for:
   ```
   Set-Cookie: auth-token=...; Path=/; HttpOnly; Secure; SameSite=None
   ```

5. Make another request (like to dashboard)
6. Check the request headers should include:
   ```
   Cookie: auth-token=...
   ```

---

## 🔍 Most Common Mistake

### ❌ You forgot to set `NODE_ENV=production`

Without this, the code uses:
- `sameSite: 'lax'` (blocks cross-origin cookies)
- `secure: false` (might not work with HTTPS)

**How to verify:**
```bash
# SSH into server
ssh user@your-server

# Check if .env file exists
ls -la /path/to/project/server/.env

# Check if NODE_ENV is in the file
grep NODE_ENV /path/to/project/server/.env

# Or check environment variables
printenv | grep NODE_ENV
```

Should show: `NODE_ENV=production`

---

## 🚨 If Still Not Working

### Check 1: Backend Logs

Look at your server logs for these lines:
```javascript
console.log(req.cookies, 'req.cookies')
```

If it shows `{}` (empty), cookies aren't being sent.

### Check 2: Browser Console

1. Open DevTools → Application → Cookies
2. After login, check if cookie exists with:
   - **Name:** `auth-token`
   - **Domain:** `business.loveswap.io`
   - **SameSite:** `None`
   - **Secure:** ✓ checked

### Check 3: Your Frontend URL in Backend

The `FRONTEND_URL` in your backend `.env` MUST match your actual frontend domain exactly:

❌ Wrong:
```env
FRONTEND_URL=http://localhost:3000        # Wrong protocol
FRONTEND_URL=https://frontend.com/        # Extra trailing slash
FRONTEND_URL=https://www.frontend.com     # Missing www or vice versa
```

✅ Correct:
```env
FRONTEND_URL=https://your-actual-frontend.com
```

---

## 📞 Need Help?

Send me the output of:
```
https://business.loveswap.io/api/config-check
```

And tell me:
1. What frontend URL you're using
2. What you see in browser DevTools → Network → Login response headers
3. What your backend logs show for `req.cookies`

---

## ✅ Success Checklist

- [ ] Deployed updated `server/index.ts` (with `trust proxy`)
- [ ] Deployed updated `server/routes/auth.ts` (with conditional `sameSite`)
- [ ] Set `NODE_ENV=production` on server
- [ ] Set `FRONTEND_URL=https://...` on server
- [ ] Restarted backend server
- [ ] `/api/config-check` shows `"isProduction": true`
- [ ] `/api/config-check` shows `"sameSite": "none"`
- [ ] `/api/config-check` shows `"secure": true`
- [ ] Login response includes `Set-Cookie` with `SameSite=None`
- [ ] Authenticated requests include `Cookie: auth-token=...`
- [ ] Backend logs show `{ 'auth-token': '...' }` (not empty `{}`)

If ALL checkboxes are checked, it should work! 🎉


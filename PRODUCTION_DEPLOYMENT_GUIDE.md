# Production Deployment Guide

## 🔧 Cookie Authentication Fix for Cross-Origin Deployment

This guide explains how to fix the cookie authentication issue when deploying your backend and frontend on different domains.

---

## 🐛 The Problem

When deploying to production with:
- **Backend**: https://business.loveswap.io
- **Frontend**: Different domain (e.g., https://yourdomain.com)

Cookies don't work because `sameSite: 'lax'` blocks cross-origin requests.

---

## ✅ The Solution

### Changes Made:

1. **Cookie Settings** (`server/routes/auth.ts`)
   - Changed `sameSite` from `'lax'` to `'none'` in production
   - Added `path: '/'` to ensure cookies work across all routes
   - These settings allow cookies to work cross-origin when `secure: true` (HTTPS)

2. **CORS Configuration** (`server/index.ts`)
   - Updated to use `FRONTEND_URL` from environment variables
   - Added proper origin checking with credentials support
   - Allows specific origins instead of all origins

3. **Environment Variables**
   - Added `NODE_ENV` to control production vs development behavior
   - Added `FRONTEND_URL` for CORS configuration

---

## 🚀 Deployment Steps

### 1. Backend Configuration (https://business.loveswap.io)

Create/update your `.env` file with:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
JWT_SECRET=your-production-secret-key-here
MONGODB_URI=your-mongodb-connection-string
```

**Important:**
- `NODE_ENV=production` enables `sameSite: 'none'` and `secure: true`
- `FRONTEND_URL` should match your actual frontend domain
- Use a strong, unique `JWT_SECRET` (not the example one)

### 2. Frontend Configuration

Update your frontend's `.env.local` or production environment:

```env
NEXT_PUBLIC_API_URL=https://business.loveswap.io
```

### 3. HTTPS Requirement

⚠️ **Critical:** Cookies with `sameSite: 'none'` **MUST** use HTTPS (`secure: true`).

Ensure both frontend and backend are served over HTTPS:
- ✅ https://business.loveswap.io (backend)
- ✅ https://your-frontend-domain.com (frontend)
- ❌ http:// will NOT work in production

---

## 🔍 Testing the Fix

### 1. Check Cookie Settings

After login, open browser DevTools → Application/Storage → Cookies:

**Production cookies should show:**
```
Name: auth-token
Value: [JWT token]
Domain: business.loveswap.io
Path: /
Secure: ✓ (checked)
HttpOnly: ✓ (checked)
SameSite: None
```

### 2. Verify Backend Receives Cookies

Check your backend logs. After login, the middleware should log:
```javascript
{ 'auth-token': 'your-jwt-token' } 'req.cookies'
```

Instead of:
```javascript
{} 'req.cookies'  // ❌ This means cookies aren't being sent
```

### 3. Test Authentication Flow

1. Login from frontend
2. Check Network tab → Login request → Response Headers should include:
   ```
   Set-Cookie: auth-token=...; Path=/; HttpOnly; Secure; SameSite=None
   ```
3. Make authenticated requests (e.g., `/api/auth/me`)
4. Check Request Headers should include:
   ```
   Cookie: auth-token=...
   ```

---

## 🛠️ Common Issues & Solutions

### Issue 1: Still getting `req.cookies = {}`

**Check:**
- ✅ `NODE_ENV=production` is set in backend
- ✅ Both domains use HTTPS
- ✅ `FRONTEND_URL` matches your actual frontend domain
- ✅ Frontend uses `withCredentials: true` (already configured in axios-service.ts)
- ✅ Browser isn't blocking third-party cookies (check browser settings)

### Issue 2: CORS errors

**Check:**
- ✅ `FRONTEND_URL` in backend `.env` matches frontend domain exactly
- ✅ No trailing slash in URLs
- ✅ Protocol (https://) is included

### Issue 3: Cookie not persisting

**Check:**
- ✅ `maxAge` is set correctly (7 days = 604800000 ms)
- ✅ Browser allows cookies
- ✅ Clock sync between server and client

### Issue 4: Working on localhost but not production

This is the exact issue we fixed! Make sure:
- ✅ `sameSite: 'none'` in production (not 'lax')
- ✅ `secure: true` in production
- ✅ Both domains use HTTPS

---

## 📋 Environment Variables Checklist

### Backend (Required)
- [x] `NODE_ENV=production`
- [x] `FRONTEND_URL=https://your-frontend-domain.com`
- [x] `JWT_SECRET=strong-secret-key`
- [x] `MONGODB_URI=mongodb://...`
- [x] `PORT=3001` (or your preferred port)

### Frontend (Required)
- [x] `NEXT_PUBLIC_API_URL=https://business.loveswap.io`

---

## 🔒 Security Notes

### Production Best Practices:

1. **Use Strong JWT Secret**
   ```bash
   # Generate a strong secret:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Restrict CORS Origins**
   - The current config logs warnings for unknown origins
   - For maximum security, change line 33 in `server/index.ts` from `callback(null, true)` to `callback(new Error('Not allowed by CORS'))`

3. **HTTPS Only**
   - Never use HTTP in production
   - Cookies with `sameSite: 'none'` require HTTPS

4. **Cookie Settings**
   - `httpOnly: true` - prevents JavaScript access (XSS protection)
   - `secure: true` - requires HTTPS
   - `sameSite: 'none'` - allows cross-origin (required for your setup)

---

## 🔄 Local Development

For local development, the code automatically uses:
- `sameSite: 'lax'` (more permissive for same-origin)
- `secure: false` (allows HTTP)

This is controlled by `NODE_ENV` environment variable:
- `NODE_ENV=development` → same-origin cookies (localhost)
- `NODE_ENV=production` → cross-origin cookies (HTTPS required)

---

## 📊 Quick Reference

| Setting | Development | Production |
|---------|------------|------------|
| `sameSite` | `'lax'` | `'none'` |
| `secure` | `false` | `true` |
| Protocol | HTTP | HTTPS |
| CORS | Localhost | Specific domain |

---

## 🆘 Still Having Issues?

1. **Check backend logs** for cookie values
2. **Check browser DevTools** → Network tab → Headers
3. **Test with curl**:
   ```bash
   curl -v -X POST https://business.loveswap.io/api/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: https://your-frontend-domain.com" \
     -d '{"email":"test@example.com","password":"password"}' \
     --cookie-jar cookies.txt
   
   # Then test authenticated endpoint
   curl -v https://business.loveswap.io/api/auth/me \
     -H "Origin: https://your-frontend-domain.com" \
     --cookie cookies.txt
   ```

4. **Verify environment variables are loaded**:
   - Add temporary console.log in server to verify
   - Check if your hosting platform properly loads `.env` files

---

## 📝 Summary

The key fix for cross-origin cookie authentication:

```javascript
// Before (doesn't work cross-origin):
sameSite: 'lax'

// After (works cross-origin with HTTPS):
sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
secure: process.env.NODE_ENV === 'production'
```

Deploy with confidence! 🚀


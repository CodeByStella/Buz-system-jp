# 🚀 Production Environment Setup Checklist

## Critical Issue: Trust Proxy Added ✅

**New change:** Added `app.set('trust proxy', 1)` to `server/index.ts`
- This is REQUIRED when deploying behind nginx, load balancers, or any reverse proxy
- Without this, Express can't read the correct protocol (https) from X-Forwarded headers
- **Deploy this change to production immediately**

---

## 📋 Backend Environment Variables (Production Server)

On your production server at `https://business.loveswap.io`, you MUST set these:

### ✅ Method 1: Create `.env` file on server

SSH into your production server and create `server/.env`:

```bash
# Navigate to your project
cd /path/to/your/project/server

# Create .env file
nano .env
```

Add these variables:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
JWT_SECRET=your-strong-secret-here
MONGODB_URI=mongodb://your-mongodb-uri
```

### ✅ Method 2: Set environment variables in hosting platform

If using a hosting platform (Heroku, Railway, Vercel, DigitalOcean, etc.), set these in your platform's dashboard:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `FRONTEND_URL` | Your frontend URL | `https://myapp.com` |
| `PORT` | Server port | `3001` or platform default |
| `JWT_SECRET` | Strong secret key | (generate with command below) |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 Frontend Environment Variables

### Local Testing (client/env.local)
```env
NEXT_PUBLIC_API_URL=https://business.loveswap.io
```

### Production Deployment
Set in your hosting platform (Vercel, Netlify, etc.):
```env
NEXT_PUBLIC_API_URL=https://business.loveswap.io
```

---

## 🔍 Verification Steps

### Step 1: Check Environment Variables are Loaded

Add temporary logging to your backend:

```javascript
// In server/index.ts, add after const PORT = ...
console.log('🔧 Environment Check:')
console.log('  NODE_ENV:', process.env.NODE_ENV)
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL)
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET')
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ NOT SET')
```

Expected output in production:
```
🔧 Environment Check:
  NODE_ENV: production
  FRONTEND_URL: https://your-frontend-domain.com
  JWT_SECRET: ✓ Set
  MONGODB_URI: ✓ Set
```

❌ If you see `undefined` or fallback values, your environment variables are NOT loading!

### Step 2: Verify HTTPS

Both domains MUST use HTTPS:
- ✅ `https://business.loveswap.io` (backend)
- ✅ `https://your-frontend-domain.com` (frontend)
- ❌ `http://` will NOT work

Test in browser:
```bash
curl -I https://business.loveswap.io/api/health
```

Should show: `HTTP/2 200` or `HTTP/1.1 200` with SSL certificate

### Step 3: Test Cookie Settings

After login, check browser DevTools → Application → Cookies:

**Expected Cookie Attributes:**
```
Name: auth-token
Domain: business.loveswap.io
Path: /
Secure: ✓ (must be checked)
HttpOnly: ✓ (must be checked)
SameSite: None (critical for cross-origin)
```

### Step 4: Test CORS Headers

Open browser DevTools → Network tab, login, and check the response headers:

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Credentials: true
Set-Cookie: auth-token=...; Path=/; HttpOnly; Secure; SameSite=None
```

### Step 5: Verify Backend Receives Cookies

Check your backend logs after login and making an authenticated request:

**Expected logs:**
```javascript
{ 'auth-token': 'eyJhbGc...' } 'req.cookies'  // ✅ Good
eyJhbGc... 'token'
```

**Bad logs (current issue):**
```javascript
{} 'req.cookies'  // ❌ Cookies not being sent
```

---

## 🚨 Common Production Deployment Issues

### Issue 1: Environment Variables Not Loading

**Symptoms:** 
- `NODE_ENV` is `undefined` or `development`
- Cookies still use `sameSite: 'lax'`

**Solutions:**

#### If using PM2:
```bash
# Use ecosystem file
pm2 start ecosystem.config.js

# Or pass env vars
pm2 start server/index.js --name api --env production
```

#### If using Docker:
```dockerfile
# In Dockerfile or docker-compose.yml
ENV NODE_ENV=production
ENV FRONTEND_URL=https://your-domain.com
```

#### If using systemd:
```ini
# /etc/systemd/system/myapp.service
[Service]
Environment="NODE_ENV=production"
Environment="FRONTEND_URL=https://your-domain.com"
```

#### If using Heroku/Railway/Render:
- Go to Settings → Environment Variables
- Add each variable through the web UI
- Restart the app

### Issue 2: Using Process Manager Without --env Flag

If you're using PM2, nodemon, or forever, ensure you're loading the `.env` file:

```bash
# Install dotenv-cli globally
npm install -g dotenv-cli

# Run with dotenv
dotenv -e server/.env -- node server/index.js
```

Or in your `package.json`:
```json
{
  "scripts": {
    "start": "node -r dotenv/config server/index.js"
  }
}
```

### Issue 3: Reverse Proxy Configuration

If using nginx, ensure these headers are forwarded:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Issue 4: Forgot to Restart After Env Changes

After changing environment variables, ALWAYS restart:

```bash
# PM2
pm2 restart all

# Docker
docker-compose down && docker-compose up -d

# Systemd
sudo systemctl restart myapp

# Manual
kill <process-id>
npm start
```

### Issue 5: Browser Blocking Third-Party Cookies

Some browsers block third-party cookies by default. Tell users to check:

**Chrome:** Settings → Privacy → Cookies → Allow all cookies
**Firefox:** Settings → Privacy → Custom → Cookies → Uncheck "Cross-site cookies"
**Safari:** Preferences → Privacy → Uncheck "Prevent cross-site tracking"

---

## 🧪 Testing Commands

### Test Backend Health
```bash
curl https://business.loveswap.io/api/health
```

### Test Login
```bash
curl -v -X POST https://business.loveswap.io/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-frontend-domain.com" \
  -d '{"email":"admin@example.com","password":"admin"}' \
  --cookie-jar cookies.txt
```

Look for `Set-Cookie` header with `SameSite=None; Secure`

### Test Authenticated Request
```bash
curl -v https://business.loveswap.io/api/auth/me \
  -H "Origin: https://your-frontend-domain.com" \
  --cookie cookies.txt
```

Should return user data, not 401 error

---

## 📝 Quick Deployment Checklist

Before claiming "it's deployed":

- [ ] `NODE_ENV=production` is set on production server
- [ ] `FRONTEND_URL` is set to actual frontend domain
- [ ] `JWT_SECRET` is set to strong, unique value
- [ ] `MONGODB_URI` is set to production database
- [ ] Backend is accessible via HTTPS (not HTTP)
- [ ] Frontend is accessible via HTTPS (not HTTP)
- [ ] Backend server has been restarted after env changes
- [ ] `app.set('trust proxy', 1)` is in code and deployed
- [ ] Browser DevTools shows `SameSite=None; Secure` on cookies
- [ ] Backend logs show `{ 'auth-token': '...' }` not `{}`
- [ ] CORS headers include `Access-Control-Allow-Credentials: true`

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Add more logging to `server/routes/auth.ts`:**

```javascript
router.post('/login', async (req, res) => {
  console.log('🔍 Login Debug:')
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  console.log('  Origin:', req.headers.origin)
  console.log('  Protocol:', req.protocol)
  console.log('  Secure:', req.secure)
  
  // ... existing login code ...
  
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  }
  
  console.log('🍪 Cookie Options:', cookieOptions)
  res.cookie('auth-token', token, cookieOptions)
})
```

2. **Check what the frontend is sending:**

In browser DevTools → Network → Login request → Headers:
```
Request Headers:
  Origin: https://your-frontend-domain.com
  Content-Type: application/json
```

3. **Verify axios is sending credentials:**

In `client/lib/axios-service.ts` (line 24), confirm:
```javascript
withCredentials: true,  // ✅ Should be true
```

4. **Check if FRONTEND_URL matches exactly:**

In backend logs:
```javascript
console.log('Allowed origins:', allowedOrigins)
console.log('Request origin:', req.headers.origin)
```

They MUST match exactly (no trailing slashes, same protocol).

---

## 🎯 Most Likely Issues (In Order)

1. **`NODE_ENV` not set to `production`** → Cookies use `sameSite: 'lax'`
2. **Server not restarted** → Old code still running
3. **Environment variables in wrong location** → `.env` file not where server expects
4. **Using HTTP instead of HTTPS** → `secure: true` fails
5. **FRONTEND_URL doesn't match** → CORS blocks requests
6. **Forgot to deploy `trust proxy` change** → Cookies not set properly
7. **Browser blocking cookies** → Check browser settings

---

## 💡 Pro Tip

Create a health check endpoint that shows your configuration (without secrets):

```javascript
app.get('/api/config', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasFrontendUrl: !!process.env.FRONTEND_URL,
    frontendUrl: process.env.FRONTEND_URL, // Remove in production
    hasJwtSecret: !!process.env.JWT_SECRET,
    protocol: req.protocol,
    secure: req.secure,
    trustProxy: app.get('trust proxy')
  })
})
```

Visit `https://business.loveswap.io/api/config` to verify settings.

---

Good luck! 🚀


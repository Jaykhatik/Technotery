# 🚀 DEPLOYMENT.md — Environment, PM2 & CI/CD

## Environment Variables

### Server `.env`

```env
# ─── App ──────────────────────────────────────────────
NODE_ENV=development                 # development | production | test
PORT=5000
CLIENT_URL=http://localhost:5173     # Frontend origin (for CORS)
ALLOWED_ORIGINS=http://localhost:5173,https://yourapp.com

# ─── Database ─────────────────────────────────────────
MONGODB_URI=mongodb://localhost:27017/airbnb_dev

# ─── Auth ─────────────────────────────────────────────
JWT_ACCESS_SECRET=your_32_char_access_secret_here_min
JWT_REFRESH_SECRET=your_32_char_refresh_secret_here_min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Stripe ───────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── File Storage ─────────────────────────────────────
UPLOAD_DIR=public/uploads            # relative to server root
MAX_FILE_SIZE_MB=5                   # per file limit
BASE_URL=http://localhost:5000       # used to build image URLs

# ─── Email ────────────────────────────────────────────
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@yourapp.com
EMAIL_FROM_NAME=AirBnB Clone

# ─── Google OAuth (optional) ──────────────────────────
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# ─── Logging ──────────────────────────────────────────
LOG_LEVEL=debug    # error | warn | info | debug
```

### Client `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

> **Never commit `.env` files.** Only commit `.env.example` with placeholder values.

---

## Local Services Setup

No Docker, no Redis. Run MongoDB natively and manage Node processes with **PM2**.

### Prerequisites

```bash
# Node.js 20+
node -v   # should print v20.x.x

# MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# MongoDB (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod

# PM2 — global process manager
npm install -g pm2
```

Verify MongoDB is running:
```bash
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

### Public Uploads Folder

Images are stored in `server/public/uploads/` and served as static files by Express.

```bash
# Create the uploads directory (do this once)
mkdir -p server/public/uploads

# Add to .gitignore so uploaded files aren't committed
echo "server/public/uploads/*" >> .gitignore
echo "!server/public/uploads/.gitkeep" >> .gitignore
touch server/public/uploads/.gitkeep
```

Express serves the folder at `/uploads/*`:
```typescript
// server/src/app.js
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
```

Uploaded image URLs will look like: `http://localhost:5000/uploads/listings/abc123.jpg`

In production, Nginx serves the `public/uploads/` folder directly (bypassing Node) for better performance — see Nginx config below.

---

## PM2 Setup

### `ecosystem.config.js` (root of project)

```javascript
module.exports = {
  apps: [
    {
      name: 'airbnb-server',
      cwd: './server',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 10,
      out_file: './logs/server-out.log',
      error_file: './logs/server-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'airbnb-client',
      cwd: './client',
      script: 'npx',
      args: 'serve dist -p 3000 -s',
      instances: 1,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
      out_file: './logs/client-out.log',
      error_file: './logs/client-error.log',
    },
  ],
};
```

### Development Workflow

```bash
# Terminal 1 — Express server (hot reload)
cd server && npm run dev

# Terminal 2 — React dev server (Vite HMR)
cd client && npm run dev
```

`package.json` scripts in `server/`:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.js",
    "build": "tsc --project tsconfig.json",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts",
    "test": "jest --runInBand"
  }
}
```

`package.json` scripts in `client/`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest"
  }
}
```

### Production Workflow

```bash
# 1. Build both apps
cd server && npm run build && cd ..
cd client && npm run build && cd ..

# 2. Create logs directory
mkdir -p logs

# 3. Start with PM2 in production mode
pm2 start ecosystem.config.js --env production

# 4. Save PM2 process list (survives server reboots)
pm2 save

# 5. Set PM2 to start on system boot
pm2 startup
# → Copy and run the command it prints
```

### PM2 Useful Commands

```bash
pm2 list                         # View all running processes
pm2 logs airbnb-server           # Tail server logs
pm2 monit                        # Live CPU/memory dashboard
pm2 reload airbnb-server         # Graceful reload (zero-downtime)
pm2 restart airbnb-client        # Restart static client server
pm2 stop all                     # Stop all processes
pm2 flush                        # Clear all log files
```

### Zero-Downtime Deploys

```bash
git pull origin main
cd server && npm ci && npm run build && cd ..
cd client && npm ci && npm run build && cd ..
pm2 reload airbnb-server
pm2 restart airbnb-client
```

> **Important:** Because PM2 runs in cluster mode, uploaded files written to `public/uploads/` by one worker are visible to all — they share the same filesystem. This is fine as long as you're on a single server.

---

## Nginx Reverse Proxy (Production)

```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/airbnb
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 1000;

    # ── Serve uploaded images directly from disk (bypasses Node entirely) ──
    location /uploads/ {
        alias /var/www/airbnb-clone/server/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;

        # Security: only allow image files
        location ~* \.(jpg|jpeg|png|gif|webp)$ {
            try_files $uri =404;
        }
        return 403;   # block non-image requests
    }

    # ── Express API ────────────────────────────────────────────────────────
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_read_timeout 90;

        # File upload size limit (match MAX_FILE_SIZE_MB * max files)
        client_max_body_size 60M;
    }

    # ── Stripe webhook (no body buffering) ────────────────────────────────
    location /api/payments/webhook {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # ── React frontend ─────────────────────────────────────────────────────
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/airbnb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Free SSL
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## CI/CD — GitHub Actions

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  test-server:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: cd server && npm ci
      - run: cd server && npm run lint
      - run: cd server && npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/airbnb_test
          JWT_ACCESS_SECRET: test_secret_32_chars_minimum_here
          JWT_REFRESH_SECRET: test_refresh_32_chars_minimum_here
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
          UPLOAD_DIR: public/uploads
          BASE_URL: http://localhost:5000

  test-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: cd client && npm ci
      - run: cd client && npm run lint
      - run: cd client && npm test

  build-and-deploy:
    needs: [test-server, test-client]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Build server
        run: cd server && npm ci && npm run build
      - name: Build client
        run: cd client && npm ci && npm run build
      - name: Deploy via SSH + PM2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/airbnb-clone
            git pull origin main
            cd server && npm ci && npm run build && cd ..
            cd client && npm ci && npm run build && cd ..
            pm2 reload airbnb-server
            pm2 restart airbnb-client
```

---

## Production Checklist

### Security
- [ ] `NODE_ENV=production` is set
- [ ] All secrets are in environment variables (not in code)
- [ ] Stripe LIVE keys are set (not test keys)
- [ ] `ALLOWED_ORIGINS` is set to your actual domain
- [ ] HTTPS is enforced (SSL certificate active)
- [ ] Stripe webhook secret is from the production Dashboard
- [ ] MongoDB Atlas IP allowlist is configured
- [ ] Nginx blocks non-image file types in `/uploads/`

### File Storage
- [ ] `server/public/uploads/` directory exists on server
- [ ] Directory is writable by the Node process user
- [ ] `.gitkeep` committed, actual uploads in `.gitignore`
- [ ] Nginx serving `/uploads/` directly with 30-day cache headers
- [ ] `client_max_body_size` set in Nginx (default 1MB is too small)
- [ ] Backup strategy for `public/uploads/` (rsync to S3 or similar)

### Performance
- [ ] MongoDB indexes are created (`npm run db:indexes`)
- [ ] React build is minified and code-split (`npm run build`)
- [ ] Gzip enabled in Nginx
- [ ] Image cache headers set (`Cache-Control: public, immutable`)

### Monitoring
- [ ] Error tracking configured (Sentry recommended)
- [ ] Log level is `info` or `warn` (not `debug`)
- [ ] Health check endpoint `/api/health` returns 200
- [ ] Uptime monitoring set up

### Database
- [ ] MongoDB Atlas backups enabled
- [ ] Connection pool size configured (`maxPoolSize: 10`)
- [ ] `autoIndex: false` in production Mongoose config

### CI/CD
- [ ] All tests pass in CI
- [ ] `main` branch has branch protection rules
- [ ] Deploy only triggers on `main` push after CI passes
- [ ] PM2 `ecosystem.config.js` is committed to repo
- [ ] `pm2 save` run after first deploy
- [ ] `pm2 startup` command executed (survives reboots)
- [ ] Nginx config tested with `nginx -t` before reload
- [ ] SSL certificate active via Let's Encrypt

---

## Health Check Endpoint

`GET /api/health` (no auth):

```json
{
  "status": "ok",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "services": {
    "database": "connected"
  },
  "version": "1.0.0"
}
```

---

## Database Indexes

```bash
# Run once after deploy
npm run db:indexes
# server/src/scripts/createIndexes.js
```

---

## Backup Strategy for Uploaded Files

Since files live on the server's disk (not a CDN), set up a periodic backup:

```bash
# Example: rsync uploads to S3 daily (install awscli first)
# Add to crontab: crontab -e
0 2 * * * aws s3 sync /var/www/airbnb-clone/server/public/uploads s3://your-bucket/uploads --delete
```

---

## Recommended Hosting

| Service | Use Case |
|---------|----------|
| Ubuntu VPS (DigitalOcean / Hetzner / Vultr) | Express server + PM2 + Nginx + file storage |
| MongoDB Atlas | Database (free M0 tier to start) |
| GitHub Actions | CI/CD pipeline |
| Let's Encrypt + Certbot | Free SSL certificates |
| Namecheap / Cloudflare | Domain + DNS |

> **Minimum VPS spec:** 1 vCPU, 1GB RAM, 25GB SSD. If uploads grow large, attach a block storage volume and symlink `public/uploads/` to it.

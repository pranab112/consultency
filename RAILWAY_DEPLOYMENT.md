# Railway Deployment Guide for StudyAbroad CRM

## 🚀 Deployment Steps

### 1. Prerequisites
- Railway account (https://railway.app)
- GitHub account
- Git installed locally

### 2. Prepare Your Code

First, ensure your code is ready for production:

```bash
# Build the project locally to test
cd "/Users/apple/ofiice works/conSULT/STUDYABROAD"
npm run build:all
```

### 3. Push to GitHub

Create a new GitHub repository and push your code:

```bash
cd "/Users/apple/ofiice works/conSULT/STUDYABROAD"
git init
git add .
git commit -m "Initial commit - StudyAbroad CRM"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/studyabroad-crm.git
git push -u origin main
```

### 4. Deploy on Railway

#### Option A: Deploy via GitHub (Recommended)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select the `studyabroad-crm` repository
6. Railway will automatically detect the configuration

#### Option B: Deploy via CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize a new project:
```bash
cd "/Users/apple/ofiice works/conSULT/STUDYABROAD"
railway init
```

4. Deploy:
```bash
railway up
```

### 5. Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
# Database Configuration
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_TYPE=postgres

# Server Configuration
NODE_ENV=production
PORT=${{PORT}}
CORS_ORIGIN=https://your-frontend-domain.railway.app

# Security
JWT_SECRET=your-secure-jwt-secret-here-change-this
JWT_EXPIRES_IN=7d

# Optional: Google AI API (for Gemini features)
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key

# Frontend API URL (update after deployment)
VITE_API_URL=https://your-app.railway.app/api
```

### 6. Add PostgreSQL Database

1. In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically set the `DATABASE_URL` variable
3. The backend will automatically use PostgreSQL in production

### 7. Configure Build Settings

Railway should automatically detect these settings from `railway.json`, but you can verify:

- **Build Command**: `npm install && cd server && npm install && npm run build && cd .. && npm run build`
- **Start Command**: `npm run start:prod`
- **Health Check Path**: `/api/health`

### 8. Custom Domain (Optional)

1. Go to Settings → Domains in Railway
2. Add your custom domain
3. Update DNS records as instructed

### 9. Monitor Deployment

1. Check build logs in Railway dashboard
2. Once deployed, visit the provided URL
3. Test the health endpoint: `https://your-app.railway.app/api/health`

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is set correctly
   - Ensure PostgreSQL addon is attached
   - Check if migrations ran successfully

3. **Frontend Can't Connect to Backend**
   - Update VITE_API_URL with the deployed backend URL
   - Check CORS_ORIGIN environment variable
   - Verify the API is accessible at `/api/health`

4. **Port Issues**
   - Railway automatically assigns PORT
   - Don't hardcode port numbers
   - Use `process.env.PORT || 5000`

## 📝 Post-Deployment Checklist

- [ ] Health check endpoint working (`/api/health`)
- [ ] Database connected (check logs)
- [ ] Admin login working
- [ ] Students API endpoint working
- [ ] Frontend connecting to backend
- [ ] Environment variables properly set
- [ ] CORS configured correctly

## 🔐 Security Notes

1. **Change default passwords immediately**
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Enable HTTPS** (Railway provides this automatically)
4. **Review CORS settings** for production domains
5. **Keep environment variables secure**

## 📊 Default Admin Access

After deployment, login with:
- Email: `admin@studyabroad.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

## 🆘 Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check deployment logs for errors
- Use `railway logs` command for real-time logs

## 🚦 Testing the Deployment

```bash
# Test health endpoint
curl https://your-app.railway.app/api/health

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@studyabroad.com", "password": "admin123"}'
```

## 📈 Scaling

Railway automatically handles:
- SSL/HTTPS certificates
- Container orchestration
- Auto-scaling (based on plan)
- Automatic deployments from GitHub

To scale manually:
1. Go to Settings → Scaling
2. Adjust replica count
3. Configure resource limits

---

Remember to update the frontend's API URL after deployment!
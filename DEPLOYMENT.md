# Deployment Guide: Vercel + Render + Supabase

## Quick Summary
- **Frontend:** Vercel (auto-deploys from GitHub)
- **Backend:** Render (Spring Boot app)
- **Database:** Supabase (PostgreSQL)

## Step 1: Setup Supabase Database

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → Database** → Copy connection string
4. Save credentials securely

## Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. Create **New Web Service** → Connect GitHub repo
3. Set build folder to `./backend`
4. Add environment variables:
   ```
   SPRING_DATASOURCE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=[your_password]
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```
5. Build Command: `mvn clean package -DskipTests`
6. Start Command: `java -jar target/*.jar`
7. Deploy & note the backend URL (e.g., `https://your-app.onrender.com`)

## Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Set **Root Directory** to `./frontend`
4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```
5. Deploy!

## Step 4: Update Local .env Files

Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Create `backend/.env`:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/coding_platform_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
```

## Testing

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.onrender.com`
- Database: Supabase managed dashboard

## Important Notes

- Render free tier Spins down after 15 minutes of inactivity (cold start ~30s)
- Use Render's paid plan for production to keep the app always running
- Supabase free tier includes 500MB database storage
- Vercel free tier is suitable for most projects

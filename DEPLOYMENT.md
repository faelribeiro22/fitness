# Deployment Guide

This guide covers deploying the Fitness App to Railway (API) and Expo Application Services (Mobile App).

## Prerequisites

- Railway account
- Expo account
- GitHub account with repository access
- EAS CLI installed: `npm install -g eas-cli`

## Railway Deployment (API + Database)

### 1. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your fitness-app repository
4. Railway will automatically detect and deploy the API

### 2. Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set up the database
4. The `DATABASE_URL` environment variable will be automatically available

### 3. Configure Environment Variables

Add these environment variables in Railway:

```bash
PORT=3000
NODE_ENV=production
BETTER_AUTH_SECRET=your-random-secret-key
BETTER_AUTH_URL=https://your-api-url.railway.app
```

### 4. Run Database Migrations

Railway will automatically run migrations on deploy, but you can also run manually:

```bash
railway run prisma migrate deploy
```

### 5. Railway Configuration Files

The project includes Railway configuration files:

- `railway.toml` - Root configuration
- `apps/api/railway.toml` - API-specific configuration
- `railway-database.toml` - Database configuration documentation

## GitHub Actions Setup

### Required GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### For Mobile App (EAS)

- `EXPO_TOKEN`: Your Expo token (get from https://expo.dev/accounts)

#### For API (Railway)

- `RAILWAY_TOKEN`: Your Railway token (get from https://railway.app/account/tokens)
- `RAILWAY_PROJECT_ID`: Your Railway project ID (from Railway project settings)
- `TEST_DATABASE_URL`: Test database URL for E2E tests

### GitHub Actions Workflows

The project includes two CI/CD workflows:

1. **Mobile CI** (`.github/workflows/mobile-ci.yml`)
   - Runs on push/PR to main for mobile app changes
   - Lints, type-checks, tests, and builds the mobile app
   - Triggers EAS builds on main branch

2. **API CI** (`.github/workflows/api-ci.yml`)
   - Runs on push/PR to main for API changes
   - Lints, type-checks, tests, and builds the API
   - Deploys to Railway on main branch
   - Runs database migrations

## Expo Application Services (Mobile App)

### 1. Setup EAS

```bash
eas login
eas build:configure
```

### 2. Configure EAS

The project already includes `apps/app/eas.json` with build profiles.

### 3. Build for Development

```bash
pnpm --filter @fitness/mobile eas:build --platform android --profile development
```

### 4. Build for Production

```bash
pnpm --filter @fitness/mobile eas:build --platform android --profile production
pnpm --filter @fitness/mobile eas:build --platform ios --profile production
```

### 5. Submit to App Stores

```bash
pnpm --filter @fitness/mobile eas:submit --platform android --profile production
pnpm --filter @fitness/mobile eas:submit --platform ios --profile production
```

## Environment Variables

### Local Development

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### API Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `BETTER_AUTH_SECRET`: Secret key for BetterAuth
- `BETTER_AUTH_URL`: Base URL for BetterAuth

### Mobile App Environment Variables

- `EXPO_PUBLIC_API_URL`: API base URL for mobile app

## Database Setup

### Local Development

1. Install PostgreSQL locally or use Docker:

```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fitness_dev postgres:15
```

2. Run migrations:

```bash
pnpm --filter api db:migrate
```

3. Generate Prisma client:

```bash
pnpm --filter api db:generate
```

### Production (Railway)

Railway automatically handles database setup and migrations.

## Authentication Setup

The project uses BetterAuth for authentication. The setup includes:

### Backend (API)

- BetterAuth configured in `apps/api/src/auth/auth.config.ts`
- Auth endpoints in `apps/api/src/auth/auth.controller.ts`
- Database schema includes BetterAuth tables

### Frontend (Mobile)

- BetterAuth Expo client in `apps/app/src/lib/auth.ts`
- Auth functions: signUp, signIn, signOut, getSession, getUser

### API Endpoints

- `POST /auth/sign-up` - Register new user
- `POST /auth/sign-in` - Sign in user
- `POST /auth/sign-out` - Sign out user
- `GET /auth/session` - Get current session
- `GET /auth/user` - Get current user

## Deployment Checklist

Before deploying to production:

- [ ] Update BETTER_AUTH_SECRET with a secure random key
- [ ] Update BETTER_AUTH_URL with production API URL
- [ ] Update EXPO_PUBLIC_API_URL in mobile app
- [ ] Add GitHub secrets (EXPO_TOKEN, RAILWAY_TOKEN, RAILWAY_PROJECT_ID)
- [ ] Test EAS build locally first
- [ ] Test API deployment to Railway
- [ ] Run database migrations
- [ ] Test authentication flow
- [ ] Test all API endpoints
- [ ] Test mobile app with production API

## Monitoring

### Railway

- Railway provides built-in monitoring and logs
- Access logs from Railway dashboard
- Monitor database performance

### EAS

- EAS provides build logs and deployment status
- Monitor app submissions to app stores
- Check app performance and crashes

## Troubleshooting

### Build Failures

- Check GitHub Actions logs
- Verify all environment variables are set
- Ensure dependencies are properly installed
- Check for TypeScript errors

### Database Issues

- Verify DATABASE_URL is correct
- Check database migrations ran successfully
- Ensure Prisma client is generated

### Authentication Issues

- Verify BETTER_AUTH_SECRET is set
- Check BETTER_AUTH_URL matches API URL
- Ensure database tables are created
- Check session expiration settings

## Continuous Deployment

The project is set up for continuous deployment:

- **API**: Automatically deploys to Railway on push to main
- **Mobile**: Automatically builds with EAS on push to main
- **Database**: Migrations run automatically on API deployment

## Security Best Practices

- Never commit `.env` files to the repository
- Use strong, random secrets for production
- Rotate secrets regularly
- Enable 2FA on all service accounts
- Monitor for unauthorized access
- Keep dependencies updated

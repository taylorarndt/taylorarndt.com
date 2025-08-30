# GitHub Copilot Instructions — taylorarndt.com

Personal website built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Auth0 authentication, PostgreSQL database, and Cloudflare Turnstile spam protection. Features contact forms, resource management, stream ideas voting system, and media content display.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Dependencies
- **Node.js requirement**: Node 18+ (tested with v20.19.4)
- Install dependencies: `npm install` — takes ~20 seconds
- **Environment setup**: Copy example environment variables to `.env.local` (see Environment Variables section)

### Build Process
- **Development build**: `npm run dev` — starts in ~1.4 seconds on port 3000
- **Production build**: `npm run build` — takes ~15 seconds
- **Production start**: `npm run start` — requires build first
- **IMPORTANT**: Auth0 login route has compatibility issues with Next.js 14 App Router and may cause build failures. If builds fail, temporarily remove or rename `app/api/auth/login/` directory.

### Linting and Code Quality
- **Lint command**: `npm run lint`
- **WARNING**: Strict ESLint configuration causes many failures (escape characters, TypeScript any types, unused variables). These are style issues and do not break functionality.
- Common lint issues include unescaped apostrophes in JSX and TypeScript `any` type usage.

### Database Operations
- **Migration runner**: `node scripts/db-migrate.cjs [path-to-sql]`
- **Database schema**: Ideas voting system, users with admin roles
- **Initial migration**: `node scripts/db-migrate.cjs migrations/0001_init.sql`
- **Admin setup**: `node scripts/db-migrate.cjs migrations/0002_users_admin.sql`
- **Requires**: DATABASE_URL environment variable

### Deployment
- **Heroku deployment**: Uses `Procfile` with `npm run start -- -p ${PORT}`
- **Buildpack**: Node.js
- Set all environment variables via Heroku config vars

## Environment Variables

Create `.env.local` with these variables for local development:

```bash
# Auth0 Configuration (required for login functionality)
AUTH0_SECRET=your_auth0_secret_min_32_characters
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_BASE_URL=http://localhost:3000

# Contact Form & Spam Protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_TO_EMAIL=destination@example.com
CONTACT_FROM_EMAIL=verified-sender@example.com

# Database (for admin features and stream ideas)
DATABASE_URL=postgresql://user:password@localhost:5432/database
ADMIN_KEY=your_admin_api_key
```

## Validation Scenarios

**ALWAYS** run through these scenarios after making changes:

### Basic Navigation Test
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Navigate through all main pages: Home, About, Contact, Media, Resources, Stream Ideas
4. Verify all pages load without errors

### Contact Form Test
1. Navigate to `/contact`
2. Fill out the form with valid data
3. Verify client-side validation works
4. Note: Form submission requires valid SendGrid configuration

### Resources Page Test
1. Navigate to `/resources`
2. Verify resources load from `data/resources.json`
3. Check that resource categories, tags, and links display correctly

### Media Page Test
1. Navigate to `/media`
2. Verify media items load and display properly
3. Check YouTube embeds and Substack links work

## Known Issues and Workarounds

### Auth0 Compatibility Issue
- **Problem**: `app/api/auth/login/route.ts` causes TypeScript compilation errors
- **Workaround**: Remove or rename the login directory if build fails
- **Root cause**: Next.js 14 App Router compatibility with @auth0/nextjs-auth0

### ESLint Strict Configuration
- **Problem**: Many lint errors for style issues (apostrophes, TypeScript any types)
- **Impact**: Does not break functionality, only style complaints
- **Workaround**: Focus on fixing actual functional issues, not style warnings

### SendGrid API Warnings
- **Problem**: "API key does not start with 'SG.'" warning during build
- **Impact**: Build succeeds, only affects email functionality
- **Workaround**: Set proper SENDGRID_API_KEY for email features

## Repository Structure

### Key Directories
- `/app` - Next.js App Router pages and API routes
- `/app/api` - API endpoints (contact, resources, ideas, auth)
- `/data` - JSON data files (resources.json, pending-resources.json, etc.)
- `/migrations` - PostgreSQL database migrations
- `/scripts` - Utility scripts (database migration runner)
- `/components` - Reusable React components
- `/lib` - Utility libraries (auth, database connections)

### Important Files
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration with image domains
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `auth0.config.ts` - Auth0 authentication setup
- `PRD.md` - Product Requirements Document

### Data Files
- `data/resources.json` - Curated resources displayed on /resources
- `data/pending-resources.json` - User-submitted resources awaiting approval
- `data/ideas.json` - Stream ideas (also stored in database)
- `data/votes.json` - Votes for stream ideas

## API Endpoints

### Contact API
- **POST** `/api/contact` - Submit contact form
- **Features**: Rate limiting, spam protection, SendGrid integration
- **Validation**: Server-side validation with Turnstile verification

### Resources API
- **POST** `/api/resources/submit` - Submit new resource for approval
- **PATCH** `/api/resources/approve` - Approve pending resource (admin only)

### Ideas/Streams API
- **GET/POST** `/api/ideas` - List/create stream ideas
- **POST** `/api/ideas/[id]/vote` - Vote for idea
- **PATCH** `/api/ideas/[id]/status` - Update idea status (admin)

### Auth API
- **GET/POST** `/api/auth/[auth0]` - Auth0 authentication routes
- **GET** `/api/auth/me` - Current user info

## Common Tasks

### Adding New Resources
1. Edit `data/resources.json` directly, or
2. Use the submission form at `/resources/submit` (requires approval)

### Managing Stream Ideas
1. Database-driven system with voting
2. Admin functions require authentication and ADMIN_KEY
3. Ideas progress through: Pending → Approved → Scheduled → Live → Completed

### Updating Media Content
1. Edit hardcoded content in `app/media/page.tsx`
2. Or integrate with external APIs (RSS feed endpoint exists at `/api/media/rss`)

### Email Configuration
1. Set up SendGrid account and get API key
2. Verify sender email in SendGrid
3. Configure SENDGRID_API_KEY and email addresses in environment

## Performance Notes

- **Build time**: ~15 seconds (very fast)
- **Dev server startup**: ~1.4 seconds
- **No heavy build processes**: Simple Next.js compilation
- **Image optimization**: Configured for YouTube, Substack, and AWS S3 domains

## Security Features

- **Rate limiting**: In-memory rate limiting for contact and resource APIs
- **Input validation**: Server-side validation and sanitization
- **Spam protection**: Cloudflare Turnstile integration
- **Authentication**: Auth0 integration for admin features
- **Environment variables**: All secrets via environment, not committed to repo

Always test your changes by running through the validation scenarios above. The application should render properly and navigate smoothly between all pages.
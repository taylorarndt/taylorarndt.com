# Admin Role Management Guide

This guide helps you troubleshoot and fix admin role issues in the YouTube Video Tracker application.

## Quick Fix Commands

### Check Current User Status
```bash
npm run admin check taylor@techopolisonline.com
```

### Grant Admin Role
```bash
npm run admin make-admin taylor@techopolisonline.com
```

### List All Users
```bash
npm run admin list
```

### Initialize Admin from Environment
```bash
npm run admin init
```

## Troubleshooting Steps

### 1. Check Environment Variables
Ensure `.env.local` contains:
```env
ADMIN_EMAIL=taylor@techopolisonline.com
DATABASE_URL=your_database_connection_string
```

### 2. Test Admin Access
1. Visit `/admin/debug` in your browser
2. Sign in with Auth0
3. Check if your admin status is correct
4. Use the debug panel to test admin functionality

### 3. Database Issues
If you can't connect to the database:
1. Verify DATABASE_URL is correct
2. Check database is accessible
3. Run migrations: `npm run db:migrate`

### 4. Auth0 Configuration
Verify these settings in Auth0 dashboard:
- Domain matches AUTH0_ISSUER_BASE_URL
- Client ID and Secret are correct
- Callback URLs include your domain

## Admin Logic Flow

The application checks admin status in this order:

1. **Database Check**: Queries `users` table for `is_admin = true`
2. **Environment Fallback**: If user matches `ADMIN_EMAIL`, grants admin access
3. **Auto-Update**: If env says admin but DB doesn't, updates DB automatically

## Manual Database Commands

If you need to manually update the database:

```sql
-- Check user status
SELECT id, email, name, is_admin FROM users WHERE email = 'taylor@techopolisonline.com';

-- Grant admin role
UPDATE users SET is_admin = TRUE, updated_at = NOW() WHERE email = 'taylor@techopolisonline.com';

-- Create new admin user
INSERT INTO users (id, email, name, is_admin, created_at, updated_at) 
VALUES ('admin-taylor', 'taylor@techopolisonline.com', 'Taylor Arndt', TRUE, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET is_admin = TRUE, updated_at = NOW();
```

## Common Issues & Solutions

### Issue: "Access Denied" on admin page
**Solution**: Run `npm run admin make-admin your@email.com`

### Issue: Auth0 login not working
**Solution**: Check AUTH0_ISSUER_BASE_URL format in .env.local

### Issue: Database connection errors
**Solution**: Verify DATABASE_URL and network connectivity

### Issue: User has admin role but can't access admin features
**Solution**: 
1. Check `/admin/debug` page for detailed status
2. Clear browser cookies/localStorage
3. Re-login to refresh session

## Admin Panel Features

Once admin access is working, you can:

- **Approve/Reject Ideas**: Manage submitted stream ideas
- **Schedule Streams**: Set dates and YouTube links
- **Update Status**: Change idea status (Pending → Approved → Scheduled → Live → Completed)
- **View Analytics**: Monitor engagement and votes

## ORM Recommendation

For easier database management, consider these ORMs with admin panels:

### 1. Prisma (Recommended)
- **Pros**: Excellent TypeScript support, built-in admin UI (Prisma Studio)
- **Setup**: `npm install prisma @prisma/client`
- **Admin UI**: Run `npx prisma studio` for web-based admin

### 2. Drizzle ORM
- **Pros**: Lightweight, SQL-like syntax
- **Admin Panel**: Drizzle Kit provides basic admin features

### 3. PostgREST + PostgREST Admin
- **Pros**: Auto-generated REST API, powerful admin interface
- **Setup**: External service that reads your PostgreSQL schema

## Next Steps

1. **Fix Current Issue**: Use the admin manager script to grant proper roles
2. **Consider ORM**: If you want a full admin panel, Prisma is recommended
3. **Database Backup**: Before making changes, backup your database
4. **Monitoring**: Set up logging to track admin access issues

## Support

If issues persist:
1. Check application logs for Auth0/database errors
2. Use the debug page at `/admin/debug`
3. Verify all environment variables are set correctly
4. Test with a fresh browser session
# taylorarndt.com

This repository is a Next.js + Tailwind personal site for taylorarndt.com.

Local dev:

```bash
npm install
npm run dev
```

Environment variables (copy `.env.example` to `.env.local`):
- NEXT_PUBLIC_TURNSTILE_SITE_KEY: Cloudflare Turnstile site key (public)
- TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key (server)
- SENDGRID_API_KEY: SendGrid API key for email sending
- CONTACT_TO_EMAIL: Destination email for contact messages
- CONTACT_FROM_EMAIL: Verified sender email in SendGrid

Deploy to Heroku:
- Set buildpack to Node.js
- Set env vars above via Heroku config vars
- Procfile uses `npm run start` with `${PORT}`


My website

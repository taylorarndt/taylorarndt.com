# Product Requirements Document (PRD) — taylorarndt.com

- Document version: 0.1 (Draft)
- Last updated: 2025-08-29
- Owner: Site Owner / Maintainers
- Status: Draft for review

## 1. Purpose and context
Build a modern, accessible, and performant personal website for Taylor Arndt using Next.js (App Router) with React and Tailwind CSS. The site should clearly present who Taylor is, services/offerings, media presence, resources, and a reliable contact method. The experience must be fast, responsive, and inclusive.

## 2. Goals and non-goals
- Goals
  - G1: Communicate Taylor’s brand, expertise, and offerings clearly.
  - G2: Provide easy navigation to About, Media, Resources, and Contact.
  - G3: Enable users to send messages via a reliable contact form.
  - G4: Achieve excellent Core Web Vitals and WCAG 2.1 AA accessibility.
  - G5: Ensure simple content updates (JSON-driven where appropriate).
- Non-goals
  - NG1: Full CMS integration (e.g., headless CMS) at this stage.
  - NG2: User authentication, dashboards, or gated content.
  - NG3: Complex multi-language i18n (may be considered later).

## 3. Target users and use cases
- Users
  - Prospective clients/partners, podcast/bookers, community members.
  - Screen-reader and keyboard-only users.
  - Mobile-first audience with varying network conditions.
- Key use cases
  - U1: Learn about Taylor and services (About page).
  - U2: Discover media appearances and content (Media page).
  - U3: Browse curated resources (Resources page, JSON-backed).
  - U4: Contact Taylor via a form (Contact page) and receive confirmation.

## 4. Success metrics (KPIs)
- S1: Core Web Vitals (on production):
  - LCP < 2.5s (p75), CLS < 0.1, INP < 200ms.
- S2: Accessibility: Automated checks show WCAG 2.1 AA pass; manual key flows usable by keyboard and screen readers.
- S3: Contact: Form submission error rate < 1%, spam reduced via honeypot/validation.
- S4: SEO: Pages discoverable with structured metadata; sitemap present.

## 5. Scope and requirements

### 5.1 Pages and navigation (App Router)
- FR-1: Global navigation with links to Home, About, Media, Resources, Contact.
- FR-2: Persistent footer with contact link, social links, and copyright.
- FR-3: Pages (file-based routing under `app/`):
  - Home (`/`): Brief intro, primary CTA to Contact and secondary to About.
  - About (`/about`): Bio, photo/alt text, highlights.
  - Media (`/media`): Embeds or links to podcasts, talks, press. Items include title, description, date, link/platform, optional media embed.
  - Resources (`/resources`): Renders from `data/resources.json`; each item shows title, summary, tags, and link.
  - Contact (`/contact`): Accessible form posting to `app/api/contact/route.ts`.
- FR-4: 404 page and basic error boundary messaging.

### 5.2 Content and data
- FR-5: Resources list is sourced from `data/resources.json` (current file retained). Structure:
  - id (string), title (string), url (string), summary (string), tags (string[]), updatedAt (ISO string).
- FR-6: Media items may be inline (static array) or JSON similar to resources; initial MVP can be hardcoded.
- FR-7: All images must include descriptive `alt` text. Prefer local assets where possible.

### 5.3 Contact form and API
- FR-8: Contact form fields: name (required), email (required, email format), message (required, 10–2000 chars), optional subject.
- FR-9: Client-side validation with clear, accessible error messages.
- FR-10: Server-side validation in `app/api/contact/route.ts` with rate limiting (basic IP-based, best-effort) and spam mitigation (honeypot hidden field, minimum submission time check, and content length checks).
- FR-11: Delivery options (choose one for MVP):
  - E-mail via provider (SMTP/transactional) using env secrets, or
  - Persist to append-only log/file for manual review during MVP, or
  - Integrate with a form service webhook (fallback).
- FR-12: API returns JSON with success boolean and message; UI shows success toast/inline confirmation and resets fields on success.

### 5.4 Accessibility (WCAG 2.1 AA)
- FR-13: Keyboard navigable UI, visible focus states, skip-to-content link.
- FR-14: Landmarks (`header`, `nav`, `main`, `footer`) and semantic HTML.
- FR-15: Color contrast AA; support prefers-reduced-motion.
- FR-16: Form labels, `aria-invalid`, `aria-describedby`, and error summaries.

### 5.5 Visual design and Tailwind
- FR-17: Tailwind for styling with a simple, consistent design system:
  - Color tokens (primary, surface, text, accent) and spacing scale.
  - Responsive breakpoints (sm, md, lg, xl) with mobile-first layouts.
  - Light/dark mode support is desirable (nice-to-have) but can be deferred.

### 5.6 SEO and social
- FR-18: Use Next.js Metadata API for titles, descriptions, canonical URLs.
- FR-19: Open Graph and Twitter Card metadata (image, title, description).
- FR-20: Sitemap.xml generation and robots.txt present.

### 5.7 Analytics and observability
- FR-21: Privacy-friendly analytics (e.g., Vercel Analytics or GA4) with IP anonymization.
- FR-22: Basic runtime logging for API errors; no PII in logs.

### 5.8 Performance and quality
- FR-23: Optimize images (next/image) and lazy-load non-critical media.
- FR-24: Tree-shake and defer non-critical scripts; no render-blocking CSS/JS.
- FR-25: Preload key fonts; use system fonts if custom fonts aren’t critical.
- FR-26: Lighthouse score 90+ for Performance/Accessibility/Best Practices/SEO in production.

### 5.9 Security and privacy
- FR-27: Sanitize and validate all inputs server-side.
- FR-28: Rate limiting on contact API (best-effort, MVP level).
- FR-29: Secrets via environment variables; no secrets committed to repo.
- FR-30: Content Security Policy (CSP) defined with safe defaults (report-only initially acceptable).

## 6. Out of scope (for now)
- OS-1: Full CMS, user auth, payments/e-commerce, push notifications.
- OS-2: Extensive i18n; only English is required for MVP.
- OS-3: Advanced media hosting pipelines.

## 7. Assumptions
- A1: Next.js App Router is used (project already structured under `app/`).
- A2: TypeScript is enabled; Tailwind is configured (`tailwind.config.ts`).
- A3: Deployment target will be Vercel or a Node host; environment variables can be set securely.
- A4: `data/resources.json` is the single source for Resources in MVP.

## 8. Technical approach
- Next.js (App Router) + React + Tailwind CSS. Server Components by default; Client Components only where needed (form interactivity, toasts).
- Shared layout in `app/layout.tsx`, global styles in `app/globals.css`.
- Page components at `app/*/page.tsx`; API at `app/api/*/route.ts`.
- Use `next/image` for images and `next/link` for routing.
- Minimal dependencies; avoid heavy UI frameworks; rely on Tailwind utilities.

## 9. Acceptance criteria
- AC-1: All specified pages render with correct content and navigation.
- AC-2: Resources page renders items from JSON with correct fields.
- AC-3: Contact form validates client and server side; API returns expected JSON; success/failed states are clearly communicated.
- AC-4: Keyboard-only navigation works; focus is visible; skip link present.
- AC-5: Metadata, sitemap, and robots.txt exist and are correct.
- AC-6: Lighthouse and automated a11y checks meet thresholds; manual spot checks pass.

## 10. Milestones and timeline (indicative)
- M0 (Today): PRD approved.
- M1 (1–2 days): Navigation, layout, and page scaffolds in place.
- M2 (2–3 days): Content pass (About, Media, Resources from JSON).
- M3 (1–2 days): Contact form and API with validation and spam controls.
- M4 (1 day): SEO, analytics wiring, sitemap/robots, QA polish.
- M5 (0.5 day): Launch to production and post-launch monitoring.

## 11. Risks and mitigations
- R1: Spam through contact form → Honeypot, rate limiting, server validation.
- R2: Accessibility regressions → Add automated checks to CI and manual spot tests.
- R3: Performance regressions → Use `next/image`, avoid heavy client JS, measure CWV.
- R4: Missing or outdated content → Make JSON-driven sections easy to update.

## 12. Dependencies
- Next.js, React, Tailwind CSS, Node 18+ runtime.
- Optional: Analytics provider; mail delivery provider if chosen.

## 13. Open questions
- OQ-1: Which email/service provider for contact delivery (SMTP vs. transactional vs. webhook)?
- OQ-2: Do we need dark mode at launch?
- OQ-3: Preferred analytics solution (Vercel Analytics vs. GA4 vs. other)?
- OQ-4: Any additional pages (e.g., Services, Speaking, Blog) planned soon?

## 14. Appendix
- Content structure reference:
  - Resources JSON: `[{ id, title, url, summary, tags, updatedAt }]`
  - Media items: `[{ id, title, url, type, date, summary, embed? }]` (MVP may hardcode.)
- Quality checklist (pre-launch):
  - [ ] Lighthouse p75 CWV thresholds met.
  - [ ] Axe/aria checks pass; color contrast verified.
  - [ ] Sitemap and robots validated.
  - [ ] Contact API tested for success and failure paths.
  - [ ] No secrets in repo; envs configured in hosting.

---

End of PRD.
# WebSights - Project Notes for Claude

## What is this?
AI-powered website builder for UK tradespeople (plumbers, electricians, builders, etc.). Think Lovable/Bolt but niche-targeted for trades with industry-specific features.

**Domain:** websights.co.uk (owned since 1997 - good SEO history)
**Owner:** Duncan Pollard (also owns qlgmedia.co.uk for lead gen)

## Business Model
- Free to build, £25/month when going live
- Target: 1000 customers = £25k/month ARR
- Upsells: Print products (business cards, workwear, mugs via Prodigi/Gelato APIs), domains, email

## Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database:** MySQL 8.0 on MAMP (port 8889, user: root, pass: root)
- **Auth:** Custom JWT-based (bcryptjs for passwords, jsonwebtoken for tokens)
- **Hosting:** Local dev on MAMP, production TBD (likely Vercel + Digital Ocean)

## Database Schema (MySQL: `websights`)
```sql
users - id, email, password_hash, name, trade, business_name, location, phone, services, existing_website, competitors, created_at, updated_at
sites - id, user_id, subdomain, custom_domain, site_config (JSON), status (draft/live), created_at, updated_at
sessions - id, user_id, token, expires_at, created_at
```

## Project Structure
```
/Applications/MAMP/htdocs/websights/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (hero, features, pricing, industries)
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Tailwind + custom styles
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # Login form
│   │   │   └── signup/page.tsx         # 5-step onboarding wizard
│   │   ├── (marketing)/                # Features, pricing, about pages (TODO)
│   │   │   └── industries/             # Trade-specific landing pages for FB ads (TODO)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Main editor with AI chat + preview
│   │   │   ├── billing/page.tsx        # Stripe checkout + subscription management
│   │   │   └── domains/page.tsx        # Domain connection + DNS setup
│   │   └── api/
│   │       ├── auth/                   # signup, login, logout, me
│   │       ├── site/                   # generate, modify, load
│   │       ├── stripe/                 # checkout, webhook, portal
│   │       └── domains/                # suggest, check, connect
│   ├── components/
│   │   ├── marketing/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   └── SitePreview.tsx         # Renders site from config
│   │   └── ui/
│   │       └── Logo.tsx                # Eye/globe icon logo
│   └── lib/
│       ├── db.ts                       # MySQL connection pool
│       ├── auth.ts                     # Auth utilities (hash, verify, JWT)
│       ├── ai.ts                       # Claude API for site generation
│       ├── stripe.ts                   # Stripe checkout + portal
│       └── cloudflare.ts               # Domain management
├── public/
│   └── logo.svg
├── .env.local                          # Environment variables (not in git)
└── .env.example                        # Template for env vars
```

## Completed Features
- [x] Homepage with hero, industries, how-it-works, features, pricing, CTA
- [x] Header/Footer with logo
- [x] 5-step signup wizard (trade → business info → services → existing sites → account)
- [x] Login page
- [x] MySQL database with users/sites/sessions tables
- [x] JWT auth system (signup, login, logout, get current user)
- [x] **AI Site Builder** - Claude API integration for site generation and modification
- [x] **Site Preview** - Live preview component with hero, services, about, testimonials, contact, CTA sections
- [x] **Editor UI** - Full dashboard with sidebar, preview panel, and AI chat
- [x] **Stripe Integration** - Checkout, webhooks, billing portal
- [x] **Domain Management** - Cloudflare API, domain suggestions, DNS instructions
- [x] GitHub repo: https://github.com/duncanpollard-gites/websights

## TODO - Next Steps
1. **Industry Landing Pages** - /industries/plumbers, /electricians etc. for FB ad targeting
2. **Email Setup** - Cloudflare Email Routing or Mailgun
3. **Print API Integration** - Prodigi/Gelato for business cards, workwear, mugs
4. **Site Hosting/Deployment** - Deploy customer sites (Vercel API or static generation)
5. **Add real Claude API key** - Currently works in demo mode without key

## Key Features Planned
- AI chat builder ("change the header to blue", "add a gallery")
- Online booking system
- Quote/invoice system
- Review collection automation
- Industry-specific templates and suggestions
- Import existing website and improve
- Stock photos integration
- FB/Google ads campaign generator

## Useful Commands
```bash
# Start dev server
cd /Applications/MAMP/htdocs/websights && npm run dev

# MySQL CLI
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -P 8889 -h 127.0.0.1 websights

# Check users
/Applications/MAMP/Library/bin/mysql80/bin/mysql -u root -proot -P 8889 -h 127.0.0.1 -e "SELECT * FROM websights.users;"
```

## Design Decisions
- Using MySQL instead of Supabase (Duncan has hosting background, prefers own infra)
- Custom auth instead of NextAuth (simpler, full control)
- Tailwind for styling (fast iteration)
- Blue (#2563eb) as primary colour
- Eye/globe icon for logo (web + sights wordplay)

## Print API Integration Notes (from research)
- **Prodigi** - UK-based, business cards, mugs, apparel. Good API.
- **Gelato** - Strong for embroidered workwear, global network.
- Margin opportunity: Cost £20-40, charge £60-90 for business cards.
- Other products: van magnets, flyers, hi-vis, pens, mugs.

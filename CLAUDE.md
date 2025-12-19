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
│   │   │   └── page.tsx                # Main dashboard with AI chat prompt
│   │   └── api/auth/
│   │       ├── signup/route.ts
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       └── me/route.ts
│   ├── components/
│   │   ├── marketing/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       └── Logo.tsx                # Eye/globe icon logo
│   └── lib/
│       ├── db.ts                       # MySQL connection pool
│       └── auth.ts                     # Auth utilities (hash, verify, JWT)
└── public/
    └── logo.svg
```

## Completed Features
- [x] Homepage with hero, industries, how-it-works, features, pricing, CTA
- [x] Header/Footer with logo
- [x] 5-step signup wizard (trade → business info → services → existing sites → account)
- [x] Login page
- [x] Dashboard with AI chat prompt UI (placeholder)
- [x] MySQL database with users/sites/sessions tables
- [x] JWT auth system (signup, login, logout, get current user)
- [x] GitHub repo: https://github.com/duncanpollard-gites/websights

## TODO - Next Steps
1. **AI Site Builder** - The core product. User types "Add a testimonials section" → AI generates code
2. **Industry Landing Pages** - /industries/plumbers, /electricians etc. for FB ad targeting
3. **Stripe Integration** - £25/month subscription when going live
4. **Domain Management** - Cloudflare API for domain registration/DNS
5. **Email Setup** - Cloudflare Email Routing or Mailgun
6. **Print API Integration** - Prodigi/Gelato for business cards, workwear, mugs
7. **Site Hosting** - Deploy customer sites (Vercel API or static generation)

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

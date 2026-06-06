# Ledger — Product Requirements & Progress Tracker

> Stablecoin infrastructure platform enabling fintechs to launch compliant stablecoin products in months, not years.
> 
> **Status key:** `[ ]` not started · `[~]` in progress · `[x]` complete

---

## Stack

- Next.js 16.2.7 (App Router) · TypeScript 5 · Tailwind CSS v4
- TanStack Query v5 · Zustand · Prisma v6 (SQLite dev / PostgreSQL prod) · Zod
- Authentication: Auth.js v5 (next-auth@beta) with Credentials provider
- Database: SQLite (dev) → PostgreSQL (prod)

---

## MVP

Core scope for hackathon demo. Must demonstrate the end-to-end value prop: a fintech can integrate Ledger and go live with stablecoin payments fast.

---

### 1. Foundation & Project Setup

- [x] Scaffold Next.js 16 project with TypeScript strict mode
- [x] Configure Tailwind CSS v4 with custom `@theme` design tokens
- [x] Set up folder structure (`src/app`, `src/components`, `src/lib`, `src/services`, `src/types`)
- [x] Configure ESLint, Prettier, and `tsconfig.json` path aliases
- [x] Set up environment variable schema (Zod-validated at boot)
- [x] Initialize Prisma with database schema (users, organizations, transactions)
- [x] Configure authentication (session management, protected routes via Middleware)
- [x] Set up base layout: root layout, dashboard shell layout, marketing layout

---

### 2. Marketing / Landing Page

- [x] Hero section — headline, sub-headline, primary CTA ("Get API Access")
- [x] Feature highlights — 6 platform pillars with icons and one-liners
- [x] Social proof section — target customer logos / use cases
- [x] How it works — 3-step integration flow visual
- [x] CTA footer — demo request or sign-up prompt
- [x] Responsive layout (mobile + desktop)

---

### 3. Onboarding & Authentication

- [x] Sign-up flow (organization name, email, password)
- [x] Login flow with session management
- [x] Onboarding wizard: select stablecoin assets, connect environment (sandbox/live)
- [x] API key generation screen (display, copy, revoke)
- [x] Organization settings page (name, logo, members)

---

### 4. Stablecoin SDK — Core Integration

> Supports USDC at MVP. Other assets gated behind post-MVP.

- [x] Wallet connectivity UI (connect/disconnect wallet)
- [x] Wallet balance display (USDC balance with USD equivalent)
- [x] Send / Transfer flow (recipient address, amount, asset, network selection)
- [x] Transaction confirmation screen with fee estimate
- [x] Transaction status tracking (pending → confirmed → settled)
- [x] Transaction history table (filterable by date, status, asset)

---

### 5. FX Intelligence Engine

> AI signals are mocked at MVP with realistic data shapes; real model is post-MVP.

- [x] Live rate display — USDC/USD, USDC/EUR, USDC/GBP (via public price feed)
- [x] Volatility indicator — low / medium / high signal badge per pair
- [x] AI recommendation card — "Good time to convert" / "Hold — high volatility window"
- [x] Rate history sparkline chart (7-day)
- [x] Manual refresh + auto-refresh every 30 seconds

---

### 6. Smart Routing

> Route selection logic is rule-based at MVP; ML optimization is post-MVP.

- [x] Routing comparison panel — show 2–3 paths with estimated fees, speed, and rate
- [x] Best route auto-selection with explanation ("Lowest fee", "Fastest", "Best rate")
- [x] Network selector (Ethereum, Polygon, Solana — stubbed at MVP)
- [x] Confirm route and execute transaction (linked to SDK flow in Epic 4)
- [x] Routing decision log per transaction in history

---

### 7. Alert Engine — In-App

> Push / SMS / voice alerts are post-MVP. In-app notifications are MVP.

- [x] Notification center (bell icon + dropdown panel in dashboard header)
- [x] Alert types: rate threshold crossed, transaction confirmed, volatility spike
- [x] Alert configuration screen — set thresholds per asset pair
- [x] Mark as read / dismiss / clear all
- [x] Unread badge count

---

### 8. Compliance — Status Display

> Full KYC/AML/Travel Rule integration is post-MVP. MVP shows status and stubs the workflow.

- [ ] Compliance status banner per organization (Verified / Pending / Action Required)
- [ ] KYC status card with checklist (identity verified, address verified, business verified)
- [ ] AML status indicator (pass / review / flagged)
- [ ] "Complete Verification" CTA linking to stub flow
- [ ] MiCA readiness badge (EU-market indicator)

---

### 9. Analytics Hub

> Advanced cohort analysis and export are post-MVP.

- [ ] Summary metrics strip — total volume, transaction count, active wallets, avg. fee
- [ ] Transaction volume chart — bar chart, daily/weekly/monthly toggle
- [ ] Asset breakdown — pie/donut chart of USDC vs other assets
- [ ] Top corridors table — most used sender/receiver country pairs
- [ ] Date range filter (last 7d / 30d / 90d / custom)

---

## Post-MVP

Enhancements that extend the platform after the core product is proven.

---

### A. Multi-Asset Stablecoin Support

- [ ] USDT integration
- [ ] EURC integration
- [ ] PYUSD integration
- [ ] Cross-asset conversion flow (swap USDC → EURC in one transaction)
- [ ] Asset-specific analytics breakdowns

---

### B. AI-Powered FX Intelligence (Real Model)

- [ ] Train / integrate ML volatility prediction model on real market data
- [ ] Real-time signal generation with confidence scores
- [ ] Webhook delivery of FX signals to customer endpoints
- [ ] Backtesting dashboard — historical signal accuracy
- [ ] Custom alert rules with ML-suggested thresholds

---

### C. Full Compliance API

- [ ] KYC verification integration (Persona, Onfido, or equivalent)
- [ ] AML screening integration (Chainalysis or equivalent)
- [ ] Travel Rule implementation (IVMS 101 message format)
- [ ] MiCA compliance checklist and reporting export
- [ ] Compliance audit log (immutable, exportable)

---

### D. Alert Engine — Multi-Channel

- [ ] Mobile push notifications (FCM / APNs)
- [ ] SMS alerts (Twilio)
- [ ] Voice alerts (Twilio Voice)
- [ ] Alert delivery history and read receipts
- [ ] Customer-facing alert configuration portal (white-label)

---

### E. Smart Routing — ML Optimization

- [ ] Real-time liquidity data integration across networks
- [ ] ML-based slippage prediction per route
- [ ] Dynamic fee optimization based on network congestion
- [ ] A/B routing experiments with outcome tracking
- [ ] Routing performance analytics (savings vs naive routing)

---

### F. Developer Platform

- [ ] Public API documentation portal (OpenAPI / Swagger)
- [ ] JavaScript / TypeScript SDK package (npm)
- [ ] iOS SDK
- [ ] Android SDK
- [ ] Webhook management UI (register, test, inspect payloads)
- [ ] Sandbox environment with test assets

---

### G. Enterprise & Multi-Tenancy

- [ ] Multi-organization support with role-based access control (Owner / Admin / Analyst / Read-only)
- [ ] Team member invite and management
- [ ] Custom branding per organization (logo, colors)
- [ ] Audit log for all admin actions
- [ ] SLA monitoring dashboard
- [ ] Bulk transaction export (CSV / JSON)

---

### H. Advanced Analytics

- [ ] Cohort analysis — retention and volume by signup month
- [ ] Revenue attribution by corridor and asset
- [ ] Funnel analytics — onboarding completion, first transaction, recurring
- [ ] Custom dashboard builder (drag-and-drop widgets)
- [ ] Scheduled report delivery (email PDF)

---

## Notes

- All MVP screens must pass the Apple aesthetic bar defined in `02-ui-design.mdc`
- Mark items `[~]` when work begins, `[x]` on merge to main
- Post-MVP epics are ordered by estimated business impact, not difficulty

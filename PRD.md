# Product Requirements Document: Campaign Under-Delivery Risk Monitor

## 1. Product Overview

**Product Name:** Campaign Risk Monitor
**Target User:** Internal Ad Operations team at HTS Media managing sponsored travel campaigns
**Problem Statement:** Campaign ops teams managing dozens of live sponsored campaigns across travel surfaces lack early, actionable visibility into which campaigns are at risk of under-delivering against contracted goals. By the time under-delivery is obvious, it's often too late to recover.

**Solution:** A lightweight internal dashboard that ingests campaign delivery data, applies a KPI-based risk detection framework, diagnoses root causes, and surfaces AI-generated plain-language explanations with concrete remediation actions — all in a single, scannable interface.

---

## 2. User Persona

**Name:** Campaign Operations Manager
**Context:** Manages 10-50+ live travel media campaigns (sponsored listings, display, performance ads) across multiple advertisers. Needs to scan the portfolio daily, identify at-risk campaigns within seconds, understand *why* they're at risk, and know *what to do* — without digging through raw metrics.

**Key needs:**
- See all active campaigns in one view, sorted by risk
- Understand risk severity at a glance (color/icon)
- Get a plain-language explanation of the root cause
- Get a concrete recommended next action
- Drill into campaign details when deeper diagnosis is needed

---

## 3. KPI Framework (from Document 1)

### 3.1 Core KPIs (10 metrics across 5 funnel stages)

| Stage | KPI | Formula | Leading/Lagging |
|-------|-----|---------|-----------------|
| Delivery | Delivery to Goal % | delivered / goal_total | Lagging |
| Delivery | Share of Eligible Opportunities | impressions / opportunities | Leading |
| Engagement | CTR | clicks / impressions | Leading |
| Engagement | Post-click Engagement Rate | qualified_events / clicks | Leading |
| Conversion | Booking CVR | bookings / clicks | Lagging |
| Conversion | Attributed Bookings | COUNT(bookings) | Lagging |
| Efficiency | Average CPC | cost / clicks | Leading |
| Efficiency | ROAS | revenue / cost | Lagging |
| Pacing | Pacing Index | delivered_to_date / planned_to_date | Leading |
| Pacing | Forecasted Attainment % | projected_end / goal_total | Leading |

### 3.2 Severity Levels

- **Critical (Sev-1):** High probability of missing goal without immediate action
- **Warning (Sev-2):** Meaningful risk; action required within 1 business day
- **Info (Sev-3):** Anomaly detected; monitor only
- **Healthy:** On track; no intervention needed

### 3.3 Risk Thresholds (from Document 1)

| KPI | Info | Warning | Critical |
|-----|------|---------|----------|
| Pacing Index (after 24h) | < 0.95 | < 0.90 | < 0.80 |
| Forecasted Attainment | < 98% | < 95% | < 90% |
| Share of Opportunities | Drop >10% | Drop >20% | Drop >35% |
| CTR vs baseline | Drop >15% | Drop >25% | Drop >40% |
| Booking CVR vs baseline | Drop >10% | Drop >20% | Drop >35% |
| Avg CPC vs baseline | +10% | +20% | +35% |
| ROAS vs target | Below 10% | Below 20% | Below 30% |

### 3.4 Goal-Type-Specific Detection (from Document 1)

- **Impression goals:** Constrained by eligible inventory & serving mechanics
- **Click goals:** Constrained by impressions × CTR
- **Booking goals:** Constrained by clicks × CVR + conversion delay + availability
- **ROAS goals:** Revenue ÷ cost with lag adjustment

---

## 4. Remediation Framework (from Document 2)

### 4.1 Root Cause Categories

1. Budget exhaustion / funding issues
2. Narrow targeting / eligibility constraints
3. Auction competitiveness loss (bid too low)
4. Creative/offer fatigue (CTR decline)
5. Landing page / click quality issues
6. Availability / rate constraints (travel-specific)
7. Conversion tracking / technical failures
8. Data reporting delays / attribution mismatch
9. High frequency / audience exhaustion

### 4.2 Top 10 Interventions (Priority Order)

| Intervention | Impact | Timing |
|-------------|--------|--------|
| Increase campaign budget | High | Same day |
| Lower bids / CPA targets | High | 1-2 days |
| Broaden targeting/audience | High | 2-3 days |
| Refresh creative & offers | High | 2-4 days |
| Fix conversion tracking | High | Same day |
| Optimize landing pages | High | 3-5 days |
| Remove restrictive filters | Medium | 1-2 days |
| Coordinate supply updates | High | 2-3 days |
| Use platform diagnostics | Medium | Same day |
| Escalate to support | Medium | 1-7 days |

---

## 5. UI Requirements (from Document 3)

### 5.1 Level 1: Portfolio Health Table (Primary View)

**Required columns (minimal set for rapid triage):**
- Campaign Name
- Advertiser
- Goal Type + Goal Value
- Budget & Spend to Date (with % used)
- Flight Dates (start/end + days remaining)
- Pacing Status (visual indicator)
- Risk Severity (color-coded badge: Critical/Warning/Info/Healthy)
- Issue Summary (1-line plain-language explanation)
- Recommended Action (concrete next step)
- Owner/Team

**Table behaviors:**
- Default sort: Risk severity (Critical first), then pacing index ascending
- Color coding: Traffic light system (red/amber/green)
- Filters: Status, risk level, goal type, advertiser, search by name

### 5.2 Level 2: Campaign Drill-Down (Side Panel)

- Campaign header with key metadata
- Pacing visualization (actual vs planned cumulative delivery)
- Funnel metrics strip (Impressions → Clicks → Bookings → Revenue with rates)
- KPI detail cards showing each metric with baseline comparison
- Risk timeline / alert history

### 5.3 Level 3: Root Cause + Remediation Panel

- AI-generated risk explanation (2-3 sentences)
- Root cause tags
- Prioritized list of recommended actions with:
  - Action description
  - Expected impact (High/Medium/Low)
  - Expected timeline
  - Confidence level

### 5.4 Alert Fatigue Prevention

- Impact-based thresholds (budget-weighted severity)
- Group related alerts
- Dismiss/acknowledge functionality

---

## 6. Technical Architecture

### 6.1 Stack
- **Frontend:** React 19 + React Router 7 + shadcn/ui + Tailwind CSS v4
- **Backend:** Cloudflare Worker + Durable Object with SQLite
- **AI:** Workers AI via env.AI binding for risk analysis generation
- **Deployment:** Cloudflare Workers edge network

### 6.2 Data Model

**campaigns table:**
- id, name, advertiser, goal_type, goal_value, budget, spend_to_date
- start_date, end_date, status, pacing_mode, notes
- daily performance metrics (impressions, clicks, bookings, revenue, cost, opportunities)
- baseline metrics for comparison

**Computed at query time:**
- All 10 KPIs from the framework
- Risk severity classification
- Root cause identification
- Recommended actions

### 6.3 Test Dataset
- 18 campaigns spanning all 4 goal types
- Mix of healthy, warning, and critical campaigns
- Realistic travel media advertisers and scenarios
- Notes reflecting real ops situations (e.g., "launch delayed", "creative under review", "partner API down")

---

## 7. Acceptance Criteria

1. User can view all active campaigns in a sortable, filterable table
2. Each campaign shows a color-coded risk severity indicator
3. Each at-risk campaign has a plain-language issue explanation
4. Each at-risk campaign has a concrete recommended next action
5. User can click into a campaign to see detailed metrics and pacing
6. AI generates contextual risk analysis considering all KPI signals
7. System correctly applies goal-type-specific detection rules
8. Dashboard loads within 2 seconds
9. Mobile-responsive layout

---

## 8. What This Prototype Does (Summary Bullets)

- Displays a portfolio of 18 travel media campaigns with real-time risk assessment
- Applies a 10-KPI diagnostic framework across delivery, engagement, conversion, efficiency, and pacing
- Uses goal-type-specific detection rules (impressions, clicks, bookings, ROAS) to identify under-delivery risk
- AI generates plain-language explanations of why each campaign is at risk
- Provides concrete, prioritized remediation actions drawn from a travel media ops playbook
- Supports drill-down from portfolio overview → campaign detail → root cause analysis
- Designed for internal campaign ops managers who need to scan 10-50+ campaigns daily

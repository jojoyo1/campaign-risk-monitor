import { DurableObject } from "cloudflare:workers";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  goal_type: "IMP" | "CLK" | "BOOK" | "ROAS";
  goal_value: number;
  budget: number;
  spend_to_date: number;
  start_date: string;
  end_date: string;
  status: "active" | "paused" | "pending" | "completed";
  pacing_mode: "even" | "frontloaded" | "accelerated";
  notes: string;
  owner: string;
  impressions: number;
  clicks: number;
  bookings: number;
  revenue: number;
  cost: number;
  opportunities: number;
  baseline_ctr: number;
  baseline_cvr: number;
  baseline_cpc: number;
  baseline_roas: number;
  baseline_share_of_opps: number;
  created_at: string;
}

export interface KPIs {
  delivery_pct: number;
  time_elapsed_pct: number;
  pacing_index: number;
  forecast_attainment: number;
  ctr: number;
  cvr: number;
  avg_cpc: number;
  roas: number;
  share_of_opps: number;
  days_remaining: number;
  days_elapsed: number;
  daily_rate: number;
  projected_end: number;
  ctr_delta: number;
  cvr_delta: number;
  cpc_delta: number;
  roas_delta: number;
  share_of_opps_delta: number;
}

export interface RecommendedAction {
  action: string;
  impact: "high" | "medium" | "low";
  timeline: string;
}

export interface RiskAssessment {
  severity: "critical" | "warning" | "info" | "healthy";
  risk_score: number;
  root_causes: string[];
  issue_summary: string;
  recommended_actions: RecommendedAction[];
  kpis: KPIs;
}

export interface CampaignWithRisk extends Campaign, RiskAssessment {}

// ─── Constants ──────────────────────────────────────────────────────────────

const TODAY = "2026-02-27";
const MS_PER_DAY = 86400000;

// ─── Seed Data ──────────────────────────────────────────────────────────────

const SEED_CAMPAIGNS: Omit<Campaign, "created_at">[] = [
  // HEALTHY campaigns (5)
  {
    id: "camp-001",
    name: "Marriott Spring Getaway",
    advertiser: "Marriott International",
    goal_type: "IMP",
    goal_value: 500000,
    budget: 25000,
    spend_to_date: 14200,
    start_date: "2026-02-10",
    end_date: "2026-03-15",
    status: "active",
    pacing_mode: "even",
    notes: "",
    owner: "Sarah Chen",
    impressions: 295000,
    clicks: 8850,
    bookings: 265,
    revenue: 42400,
    cost: 14200,
    opportunities: 380000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.03,
    baseline_cpc: 1.6,
    baseline_roas: 3.0,
    baseline_share_of_opps: 0.78,
  },
  {
    id: "camp-002",
    name: "Hilton Summer Preview",
    advertiser: "Hilton Hotels",
    goal_type: "CLK",
    goal_value: 15000,
    budget: 30000,
    spend_to_date: 12500,
    start_date: "2026-02-15",
    end_date: "2026-03-20",
    status: "active",
    pacing_mode: "even",
    notes: "",
    owner: "Mike Torres",
    impressions: 180000,
    clicks: 6200,
    bookings: 186,
    revenue: 27900,
    cost: 12500,
    opportunities: 250000,
    baseline_ctr: 0.035,
    baseline_cvr: 0.03,
    baseline_cpc: 2.0,
    baseline_roas: 2.2,
    baseline_share_of_opps: 0.72,
  },
  {
    id: "camp-003",
    name: "Delta Vacations Package",
    advertiser: "Delta Air Lines",
    goal_type: "BOOK",
    goal_value: 800,
    budget: 40000,
    spend_to_date: 18000,
    start_date: "2026-02-05",
    end_date: "2026-03-10",
    status: "active",
    pacing_mode: "even",
    notes: "",
    owner: "Lisa Park",
    impressions: 420000,
    clicks: 14700,
    bookings: 548,
    revenue: 109600,
    cost: 18000,
    opportunities: 520000,
    baseline_ctr: 0.035,
    baseline_cvr: 0.037,
    baseline_cpc: 1.22,
    baseline_roas: 4.5,
    baseline_share_of_opps: 0.81,
  },
  {
    id: "camp-004",
    name: "Expedia Weekend Deals",
    advertiser: "Expedia Group",
    goal_type: "ROAS",
    goal_value: 4.0,
    budget: 50000,
    spend_to_date: 28000,
    start_date: "2026-02-01",
    end_date: "2026-03-05",
    status: "active",
    pacing_mode: "even",
    notes: "",
    owner: "James Wright",
    impressions: 680000,
    clicks: 23800,
    bookings: 714,
    revenue: 121380,
    cost: 28000,
    opportunities: 820000,
    baseline_ctr: 0.035,
    baseline_cvr: 0.03,
    baseline_cpc: 1.18,
    baseline_roas: 4.0,
    baseline_share_of_opps: 0.83,
  },
  {
    id: "camp-005",
    name: "Airbnb Unique Stays",
    advertiser: "Airbnb",
    goal_type: "IMP",
    goal_value: 1000000,
    budget: 35000,
    spend_to_date: 18500,
    start_date: "2026-02-12",
    end_date: "2026-03-18",
    status: "active",
    pacing_mode: "even",
    notes: "",
    owner: "Sarah Chen",
    impressions: 540000,
    clicks: 16200,
    bookings: 324,
    revenue: 48600,
    cost: 18500,
    opportunities: 700000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.02,
    baseline_cpc: 1.14,
    baseline_roas: 2.6,
    baseline_share_of_opps: 0.77,
  },

  // WARNING campaigns (6)
  {
    id: "camp-006",
    name: "Hyatt Luxury Collection",
    advertiser: "Hyatt Hotels",
    goal_type: "CLK",
    goal_value: 20000,
    budget: 45000,
    spend_to_date: 28000,
    start_date: "2026-02-08",
    end_date: "2026-03-12",
    status: "active",
    pacing_mode: "even",
    notes: "CPC rising due to competitor activity",
    owner: "Mike Torres",
    impressions: 350000,
    clicks: 11000,
    bookings: 220,
    revenue: 39600,
    cost: 28000,
    opportunities: 480000,
    baseline_ctr: 0.034,
    baseline_cvr: 0.025,
    baseline_cpc: 2.50,
    baseline_roas: 1.5,
    baseline_share_of_opps: 0.73,
  },
  {
    id: "camp-007",
    name: "Booking.com City Breaks",
    advertiser: "Booking Holdings",
    goal_type: "BOOK",
    goal_value: 600,
    budget: 35000,
    spend_to_date: 19000,
    start_date: "2026-02-10",
    end_date: "2026-03-08",
    status: "active",
    pacing_mode: "even",
    notes: "Some destination markets showing low availability",
    owner: "Lisa Park",
    impressions: 310000,
    clicks: 10850,
    bookings: 370,
    revenue: 64750,
    cost: 19000,
    opportunities: 420000,
    baseline_ctr: 0.035,
    baseline_cvr: 0.035,
    baseline_cpc: 1.75,
    baseline_roas: 2.5,
    baseline_share_of_opps: 0.74,
  },
  {
    id: "camp-008",
    name: "United MileagePlus Promo",
    advertiser: "United Airlines",
    goal_type: "IMP",
    goal_value: 750000,
    budget: 28000,
    spend_to_date: 12800,
    start_date: "2026-02-14",
    end_date: "2026-03-14",
    status: "active",
    pacing_mode: "even",
    notes: "Creative refresh pending approval",
    owner: "James Wright",
    impressions: 325000,
    clicks: 7375,
    bookings: 148,
    revenue: 22200,
    cost: 12800,
    opportunities: 420000,
    baseline_ctr: 0.032,
    baseline_cvr: 0.022,
    baseline_cpc: 1.74,
    baseline_roas: 1.8,
    baseline_share_of_opps: 0.8,
  },
  {
    id: "camp-009",
    name: "Vrbo Family Vacations",
    advertiser: "Expedia Group",
    goal_type: "ROAS",
    goal_value: 3.5,
    budget: 40000,
    spend_to_date: 22000,
    start_date: "2026-02-10",
    end_date: "2026-03-15",
    status: "active",
    pacing_mode: "even",
    notes: "ROAS trending below target in EU markets",
    owner: "Sarah Chen",
    impressions: 380000,
    clicks: 11400,
    bookings: 285,
    revenue: 71500,
    cost: 22000,
    opportunities: 520000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.025,
    baseline_cpc: 1.93,
    baseline_roas: 3.5,
    baseline_share_of_opps: 0.73,
  },
  {
    id: "camp-010",
    name: "IHG Rewards Awareness",
    advertiser: "IHG Hotels",
    goal_type: "IMP",
    goal_value: 400000,
    budget: 18000,
    spend_to_date: 11200,
    start_date: "2026-02-12",
    end_date: "2026-03-05",
    status: "active",
    pacing_mode: "even",
    notes: "Audience targeting may be too narrow",
    owner: "Mike Torres",
    impressions: 265000,
    clicks: 6625,
    bookings: 133,
    revenue: 19950,
    cost: 11200,
    opportunities: 360000,
    baseline_ctr: 0.028,
    baseline_cvr: 0.022,
    baseline_cpc: 2.3,
    baseline_roas: 1.5,
    baseline_share_of_opps: 0.75,
  },
  {
    id: "camp-011",
    name: "Carnival Cruise Deals",
    advertiser: "Carnival Corporation",
    goal_type: "CLK",
    goal_value: 12000,
    budget: 28000,
    spend_to_date: 14500,
    start_date: "2026-02-15",
    end_date: "2026-03-18",
    status: "active",
    pacing_mode: "even",
    notes: "CTR declining week over week",
    owner: "Lisa Park",
    impressions: 220000,
    clicks: 4300,
    bookings: 86,
    revenue: 17200,
    cost: 14500,
    opportunities: 300000,
    baseline_ctr: 0.028,
    baseline_cvr: 0.022,
    baseline_cpc: 2.87,
    baseline_roas: 1.5,
    baseline_share_of_opps: 0.73,
  },

  // CRITICAL campaigns (5)
  {
    id: "camp-012",
    name: "Wyndham Budget Stays",
    advertiser: "Wyndham Hotels",
    goal_type: "BOOK",
    goal_value: 500,
    budget: 30000,
    spend_to_date: 18500,
    start_date: "2026-02-05",
    end_date: "2026-03-05",
    status: "active",
    pacing_mode: "even",
    notes: "Landing page errors reported; conversion tracking may be broken",
    owner: "James Wright",
    impressions: 380000,
    clicks: 11400,
    bookings: 148,
    revenue: 22200,
    cost: 18500,
    opportunities: 500000,
    baseline_ctr: 0.032,
    baseline_cvr: 0.025,
    baseline_cpc: 1.62,
    baseline_roas: 1.8,
    baseline_share_of_opps: 0.76,
  },
  {
    id: "camp-013",
    name: "Southwest Quick Escapes",
    advertiser: "Southwest Airlines",
    goal_type: "CLK",
    goal_value: 25000,
    budget: 55000,
    spend_to_date: 38000,
    start_date: "2026-02-03",
    end_date: "2026-03-08",
    status: "active",
    pacing_mode: "even",
    notes: "Budget burn rate too high; daily cap not set",
    owner: "Sarah Chen",
    impressions: 520000,
    clicks: 12480,
    bookings: 250,
    revenue: 50000,
    cost: 38000,
    opportunities: 600000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.022,
    baseline_cpc: 3.04,
    baseline_roas: 1.5,
    baseline_share_of_opps: 0.87,
  },
  {
    id: "camp-014",
    name: "Accor All-Inclusive Push",
    advertiser: "Accor Hotels",
    goal_type: "IMP",
    goal_value: 600000,
    budget: 22000,
    spend_to_date: 8500,
    start_date: "2026-02-10",
    end_date: "2026-03-05",
    status: "active",
    pacing_mode: "even",
    notes: "Launch delayed 5 days due to creative review; severely behind pace",
    owner: "Mike Torres",
    impressions: 155000,
    clicks: 3100,
    bookings: 62,
    revenue: 9300,
    cost: 8500,
    opportunities: 350000,
    baseline_ctr: 0.025,
    baseline_cvr: 0.022,
    baseline_cpc: 2.74,
    baseline_roas: 1.2,
    baseline_share_of_opps: 0.65,
  },
  {
    id: "camp-015",
    name: "TripAdvisor Experiences",
    advertiser: "Tripadvisor",
    goal_type: "ROAS",
    goal_value: 3.0,
    budget: 32000,
    spend_to_date: 21000,
    start_date: "2026-02-08",
    end_date: "2026-03-10",
    status: "active",
    pacing_mode: "even",
    notes: "Conversion tracking intermittent; partner API issues",
    owner: "Lisa Park",
    impressions: 290000,
    clicks: 8700,
    bookings: 131,
    revenue: 34050,
    cost: 21000,
    opportunities: 400000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.02,
    baseline_cpc: 2.41,
    baseline_roas: 3.0,
    baseline_share_of_opps: 0.73,
  },
  {
    id: "camp-016",
    name: "Choice Hotels Value Pkg",
    advertiser: "Choice Hotels",
    goal_type: "BOOK",
    goal_value: 400,
    budget: 25000,
    spend_to_date: 16000,
    start_date: "2026-02-08",
    end_date: "2026-03-06",
    status: "active",
    pacing_mode: "even",
    notes: "Inventory sold out for top 3 markets; CVR collapsed",
    owner: "James Wright",
    impressions: 280000,
    clicks: 7000,
    bookings: 91,
    revenue: 11830,
    cost: 16000,
    opportunities: 380000,
    baseline_ctr: 0.028,
    baseline_cvr: 0.025,
    baseline_cpc: 2.29,
    baseline_roas: 1.2,
    baseline_share_of_opps: 0.74,
  },

  // INFO/EDGE campaigns (2)
  {
    id: "camp-017",
    name: "Radisson Blue Relaunch",
    advertiser: "Radisson Hotels",
    goal_type: "IMP",
    goal_value: 300000,
    budget: 15000,
    spend_to_date: 4400,
    start_date: "2026-02-18",
    end_date: "2026-03-18",
    status: "active",
    pacing_mode: "even",
    notes: "New campaign; monitoring closely",
    owner: "Sarah Chen",
    impressions: 93000,
    clicks: 2790,
    bookings: 56,
    revenue: 8400,
    cost: 4400,
    opportunities: 130000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.02,
    baseline_cpc: 1.88,
    baseline_roas: 1.6,
    baseline_share_of_opps: 0.71,
  },
  {
    id: "camp-018",
    name: "Norwegian Cruise Line Spring",
    advertiser: "Norwegian Cruise Line",
    goal_type: "CLK",
    goal_value: 10000,
    budget: 22000,
    spend_to_date: 5100,
    start_date: "2026-02-20",
    end_date: "2026-03-22",
    status: "active",
    pacing_mode: "even",
    notes: "Waiting on updated creative assets from client",
    owner: "Mike Torres",
    impressions: 98000,
    clicks: 2250,
    bookings: 45,
    revenue: 6750,
    cost: 5100,
    opportunities: 140000,
    baseline_ctr: 0.03,
    baseline_cvr: 0.02,
    baseline_cpc: 2.42,
    baseline_roas: 1.3,
    baseline_share_of_opps: 0.70,
  },
];

// ─── Risk Engine ────────────────────────────────────────────────────────────

function computeRisk(campaign: Campaign, today: string = TODAY): RiskAssessment {
  const startDate = new Date(campaign.start_date);
  const endDate = new Date(campaign.end_date);
  const todayDate = new Date(today);

  const totalDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  const daysElapsed = Math.max(1, (todayDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  const daysRemaining = Math.max(0, (endDate.getTime() - todayDate.getTime()) / MS_PER_DAY);
  const timeElapsedPct = Math.min(1, daysElapsed / totalDays);

  // Compute primary delivery metric based on goal type
  let deliveredUnits: number;
  let goalUnits: number;
  switch (campaign.goal_type) {
    case "IMP":
      deliveredUnits = campaign.impressions;
      goalUnits = campaign.goal_value;
      break;
    case "CLK":
      deliveredUnits = campaign.clicks;
      goalUnits = campaign.goal_value;
      break;
    case "BOOK":
      deliveredUnits = campaign.bookings;
      goalUnits = campaign.goal_value;
      break;
    case "ROAS":
      deliveredUnits = campaign.cost > 0 ? campaign.revenue / campaign.cost : 0;
      goalUnits = campaign.goal_value;
      break;
  }

  const deliveryPct = deliveredUnits / Math.max(1, goalUnits);
  const pacingIndex = timeElapsedPct > 0 ? deliveryPct / timeElapsedPct : 1;

  // Forecast: extrapolate from daily rate
  const dailyRate = daysElapsed > 0 ? deliveredUnits / daysElapsed : 0;
  const projectedEnd = deliveredUnits + dailyRate * daysRemaining;
  // ROAS is a ratio, not cumulative -- use current value directly
  const forecastAttainment =
    campaign.goal_type === "ROAS"
      ? deliveredUnits / Math.max(0.001, goalUnits)
      : projectedEnd / Math.max(1, goalUnits);

  // Current rates
  const currentCtr = campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0;
  const currentCvr = campaign.clicks > 0 ? campaign.bookings / campaign.clicks : 0;
  const currentCpc = campaign.clicks > 0 ? campaign.cost / campaign.clicks : 0;
  const currentRoas = campaign.cost > 0 ? campaign.revenue / campaign.cost : 0;
  const currentShareOfOpps =
    campaign.opportunities > 0 ? campaign.impressions / campaign.opportunities : 0;

  // Baseline deltas (positive = improvement, negative = decline)
  const ctrDelta =
    campaign.baseline_ctr > 0
      ? (currentCtr - campaign.baseline_ctr) / campaign.baseline_ctr
      : 0;
  const cvrDelta =
    campaign.baseline_cvr > 0
      ? (currentCvr - campaign.baseline_cvr) / campaign.baseline_cvr
      : 0;
  const cpcDelta =
    campaign.baseline_cpc > 0
      ? (currentCpc - campaign.baseline_cpc) / campaign.baseline_cpc
      : 0;
  const roasDelta =
    campaign.goal_type === "ROAS" && campaign.goal_value > 0
      ? (currentRoas - campaign.goal_value) / campaign.goal_value
      : 0;
  const shareOfOppsDelta =
    campaign.baseline_share_of_opps > 0
      ? (currentShareOfOpps - campaign.baseline_share_of_opps) / campaign.baseline_share_of_opps
      : 0;

  // ── Severity determination ────────────────────────────────────────────
  let severity: "critical" | "warning" | "info" | "healthy" = "healthy";

  if (pacingIndex < 0.8 || forecastAttainment < 0.9) {
    severity = "critical";
  } else if (pacingIndex < 0.9 || forecastAttainment < 0.95) {
    severity = "warning";
  } else if (pacingIndex < 0.95 || forecastAttainment < 0.98) {
    severity = "info";
  }

  // Escalation from signal deltas (can only escalate, never demote)
  if (ctrDelta < -0.25 && severity === "healthy") severity = "warning";
  if (cvrDelta < -0.2 && severity === "healthy") severity = "warning";
  if (cpcDelta > 0.2 && severity === "healthy") severity = "warning";
  if (shareOfOppsDelta < -0.2 && severity === "healthy") severity = "warning";

  // Zero delivery in first 12 hours of flight -> CRITICAL
  if (
    daysElapsed <= 0.5 &&
    campaign.impressions === 0 &&
    campaign.status === "active"
  ) {
    severity = "critical";
  }

  // ── Risk score (0-100, higher = worse) ─────────────────────────────────
  let riskScore = 0;
  if (severity === "critical") {
    riskScore = 75 + Math.min(25, Math.round((1 - forecastAttainment) * 100));
  } else if (severity === "warning") {
    riskScore = 40 + Math.min(35, Math.round((1 - pacingIndex) * 100));
  } else if (severity === "info") {
    riskScore = 15 + Math.min(25, Math.round((1 - pacingIndex) * 50));
  } else {
    riskScore = Math.max(0, Math.round((1 - pacingIndex) * 30));
  }
  riskScore = Math.min(100, Math.max(0, riskScore));

  // ── Root cause identification ─────────────────────────────────────────
  const rootCauses: string[] = [];
  const recommendedActions: RecommendedAction[] = [];

  // Goal-type specific root causes
  switch (campaign.goal_type) {
    case "IMP": {
      if (shareOfOppsDelta < -0.2) {
        rootCauses.push("Eligibility/inventory constrained");
        recommendedActions.push({
          action: "Increase bids; relax targeting restrictions",
          impact: "high",
          timeline: "1-2 days",
        });
      } else if (pacingIndex < 0.9) {
        rootCauses.push("Auction competitiveness loss");
        recommendedActions.push({
          action: "Increase bids; relax targeting restrictions",
          impact: "high",
          timeline: "1-2 days",
        });
      }
      break;
    }
    case "CLK": {
      if (ctrDelta < -0.25) {
        rootCauses.push("CTR decline");
        recommendedActions.push({
          action: "Refresh creative and copy; test new placements",
          impact: "high",
          timeline: "2-3 days",
        });
      } else if (pacingIndex < 0.9 && currentShareOfOpps < campaign.baseline_share_of_opps * 0.9) {
        rootCauses.push("Impression volume low");
        recommendedActions.push({
          action: "Increase bids; relax targeting restrictions",
          impact: "high",
          timeline: "1-2 days",
        });
      } else if (pacingIndex < 0.9) {
        rootCauses.push("CTR decline");
        recommendedActions.push({
          action: "Refresh creative and copy; test new placements",
          impact: "high",
          timeline: "2-3 days",
        });
      }
      break;
    }
    case "BOOK": {
      if (cvrDelta < -0.2) {
        rootCauses.push("Conversion rate decline");
        recommendedActions.push({
          action: "Check landing page; verify conversion tracking; align pricing",
          impact: "high",
          timeline: "1-3 days",
        });
      } else if (pacingIndex < 0.9) {
        rootCauses.push("Availability constraint");
        recommendedActions.push({
          action: "Coordinate with supply team; shift spend to available dates",
          impact: "high",
          timeline: "2-4 days",
        });
      }
      break;
    }
    case "ROAS": {
      if (roasDelta < -0.2) {
        rootCauses.push("Revenue efficiency declining");
        recommendedActions.push({
          action: "Shift budget to highest-performing segments; adjust ROAS bid targets",
          impact: "high",
          timeline: "2-3 days",
        });
      } else if (cpcDelta > 0.2) {
        rootCauses.push("Cost inflation");
        recommendedActions.push({
          action: "Broaden targeting to reduce auction pressure; lower bids",
          impact: "high",
          timeline: "1-2 days",
        });
      }
      break;
    }
  }

  // Additional signal-based root causes (cross-cutting)
  if (ctrDelta < -0.25 && !rootCauses.includes("CTR decline")) {
    rootCauses.push("CTR decline");
    recommendedActions.push({
      action: "Refresh creative and copy; test new placements",
      impact: "high",
      timeline: "2-3 days",
    });
  }

  if (cvrDelta < -0.2 && !rootCauses.includes("Conversion rate decline")) {
    rootCauses.push("Conversion rate decline");
    recommendedActions.push({
      action: "Check landing page; verify conversion tracking; align pricing",
      impact: "medium",
      timeline: "1-3 days",
    });
  }

  if (cpcDelta > 0.2 && !rootCauses.includes("Cost inflation")) {
    rootCauses.push("Cost inflation");
    recommendedActions.push({
      action: "Broaden targeting to reduce auction pressure; lower bids",
      impact: "medium",
      timeline: "1-2 days",
    });
  }

  if (shareOfOppsDelta < -0.2 && !rootCauses.includes("Eligibility/inventory constrained")) {
    rootCauses.push("Eligibility/inventory constrained");
    recommendedActions.push({
      action: "Increase bids; relax targeting restrictions",
      impact: "medium",
      timeline: "1-2 days",
    });
  }

  // Budget exhaustion check
  const budgetBurnRate = campaign.budget > 0 ? campaign.spend_to_date / campaign.budget : 0;
  if (budgetBurnRate > timeElapsedPct * 1.25 && budgetBurnRate > 0.5) {
    rootCauses.push("Budget exhaustion risk");
    recommendedActions.push({
      action: "Increase campaign budget or relax CPA targets",
      impact: "high",
      timeline: "Same day",
    });
  }

  // Pacing behind -- add generic pacing recommendation if not already covered
  if (
    pacingIndex < 0.9 &&
    !rootCauses.some(
      (rc) =>
        rc.includes("Eligibility") ||
        rc.includes("Auction") ||
        rc.includes("CTR") ||
        rc.includes("Conversion") ||
        rc.includes("Revenue") ||
        rc.includes("Cost")
    )
  ) {
    rootCauses.push("Pacing behind schedule");
    recommendedActions.push({
      action: "Switch to accelerated pacing; increase daily budget",
      impact: "high",
      timeline: "Same day",
    });
  }

  // Launch delay detection (early in flight but very low delivery)
  if (daysElapsed <= 3 && deliveryPct < 0.05 && campaign.status === "active") {
    if (!rootCauses.includes("Launch delay")) {
      rootCauses.push("Launch delay");
      recommendedActions.push({
        action: "Verify ad approval status; check targeting eligibility",
        impact: "high",
        timeline: "Same day",
      });
    }
  }

  // Add monitoring recommendation if there are issues
  if (severity !== "healthy" && recommendedActions.length > 0) {
    recommendedActions.push({
      action: "Re-evaluate in 24 hours; check if interventions are taking effect",
      impact: "low",
      timeline: "1 day",
    });
  }

  // Limit root causes to 3 most relevant
  const trimmedRootCauses = rootCauses.slice(0, 3);

  // ── Issue summary ─────────────────────────────────────────────────────
  let issueSummary: string;
  if (severity === "healthy") {
    issueSummary = "Campaign on track; all KPIs within normal range";
  } else if (severity === "info") {
    issueSummary = `Minor pacing variance detected (${(pacingIndex * 100).toFixed(0)}% of plan); monitoring recommended`;
  } else if (severity === "warning") {
    const primaryIssue = trimmedRootCauses[0] || "Performance below target";
    issueSummary = `${primaryIssue} -- pacing at ${(pacingIndex * 100).toFixed(0)}% with ${Math.round(daysRemaining)} days remaining`;
  } else {
    // critical
    const primaryIssue = trimmedRootCauses[0] || "Severe underdelivery";
    const attainmentStr =
      campaign.goal_type === "ROAS"
        ? `ROAS at ${(forecastAttainment * 100).toFixed(0)}% of target`
        : `forecast at ${(forecastAttainment * 100).toFixed(0)}% of goal`;
    issueSummary = `${primaryIssue} -- ${attainmentStr} with ${Math.round(daysRemaining)} days remaining`;
  }

  const kpis: KPIs = {
    delivery_pct: deliveryPct,
    time_elapsed_pct: timeElapsedPct,
    pacing_index: pacingIndex,
    forecast_attainment: forecastAttainment,
    ctr: currentCtr,
    cvr: currentCvr,
    avg_cpc: currentCpc,
    roas: currentRoas,
    share_of_opps: currentShareOfOpps,
    days_remaining: daysRemaining,
    days_elapsed: daysElapsed,
    daily_rate: dailyRate,
    projected_end: projectedEnd,
    ctr_delta: ctrDelta,
    cvr_delta: cvrDelta,
    cpc_delta: cpcDelta,
    roas_delta: roasDelta,
    share_of_opps_delta: shareOfOppsDelta,
  };

  return {
    severity,
    risk_score: riskScore,
    root_causes: trimmedRootCauses,
    issue_summary: issueSummary,
    recommended_actions: recommendedActions,
    kpis,
  };
}

// ─── Durable Object ─────────────────────────────────────────────────────────

export class CampaignDO extends DurableObject<Env> {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;

    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        advertiser TEXT NOT NULL,
        goal_type TEXT NOT NULL CHECK(goal_type IN ('IMP','CLK','BOOK','ROAS')),
        goal_value REAL NOT NULL,
        budget REAL NOT NULL,
        spend_to_date REAL NOT NULL DEFAULT 0,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','pending','completed')),
        pacing_mode TEXT NOT NULL DEFAULT 'even' CHECK(pacing_mode IN ('even','frontloaded','accelerated')),
        notes TEXT DEFAULT '',
        owner TEXT DEFAULT '',
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        bookings INTEGER DEFAULT 0,
        revenue REAL DEFAULT 0,
        cost REAL DEFAULT 0,
        opportunities INTEGER DEFAULT 0,
        baseline_ctr REAL DEFAULT 0,
        baseline_cvr REAL DEFAULT 0,
        baseline_cpc REAL DEFAULT 0,
        baseline_roas REAL DEFAULT 0,
        baseline_share_of_opps REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // ── RPC Methods ─────────────────────────────────────────────────────────

  /**
   * Returns all campaigns with computed KPIs and risk assessments.
   */
  async listCampaigns(): Promise<CampaignWithRisk[]> {
    const rows = this.sql
      .exec<Campaign>("SELECT * FROM campaigns ORDER BY name")
      .toArray();

    return rows.map((row) => {
      const risk = computeRisk(row);
      return { ...row, ...risk };
    });
  }

  /**
   * Returns a single campaign with full KPI breakdown and risk assessment.
   */
  async getCampaign(id: string): Promise<CampaignWithRisk | null> {
    const rows = this.sql
      .exec<Campaign>("SELECT * FROM campaigns WHERE id = ?", id)
      .toArray();

    if (rows.length === 0) return null;

    const campaign = rows[0];
    const risk = computeRisk(campaign);
    return { ...campaign, ...risk };
  }

  /**
   * Seeds the database with 18 test campaigns. Clears existing data first.
   */
  async seedData(): Promise<{ seeded: number }> {
    this.sql.exec("DELETE FROM campaigns");

    for (const c of SEED_CAMPAIGNS) {
      this.sql.exec(
        `INSERT INTO campaigns (
          id, name, advertiser, goal_type, goal_value, budget, spend_to_date,
          start_date, end_date, status, pacing_mode, notes, owner,
          impressions, clicks, bookings, revenue, cost, opportunities,
          baseline_ctr, baseline_cvr, baseline_cpc, baseline_roas, baseline_share_of_opps
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        c.id,
        c.name,
        c.advertiser,
        c.goal_type,
        c.goal_value,
        c.budget,
        c.spend_to_date,
        c.start_date,
        c.end_date,
        c.status,
        c.pacing_mode,
        c.notes,
        c.owner,
        c.impressions,
        c.clicks,
        c.bookings,
        c.revenue,
        c.cost,
        c.opportunities,
        c.baseline_ctr,
        c.baseline_cvr,
        c.baseline_cpc,
        c.baseline_roas,
        c.baseline_share_of_opps
      );
    }

    return { seeded: SEED_CAMPAIGNS.length };
  }

  /**
   * Returns the analysis context for a campaign (prompt + fallback).
   * The actual AI call is made in the route action.
   */
  async getAnalysisContext(id: string): Promise<{
    found: boolean;
    systemPrompt: string;
    userPrompt: string;
    fallback: string;
  }> {
    const campaign = await this.getCampaign(id);
    if (!campaign) {
      return { found: false, systemPrompt: "", userPrompt: "", fallback: "Campaign not found." };
    }

    const goalLabel: Record<string, string> = {
      IMP: "Impressions",
      CLK: "Clicks",
      BOOK: "Bookings",
      ROAS: "ROAS",
    };

    const userPrompt = `Analyze this campaign and provide actionable insights.

Campaign: ${campaign.name}
Advertiser: ${campaign.advertiser}
Goal: ${goalLabel[campaign.goal_type]} - target: ${campaign.goal_value}
Budget: $${campaign.budget.toLocaleString()} | Spent: $${campaign.spend_to_date.toLocaleString()} (${((campaign.spend_to_date / campaign.budget) * 100).toFixed(0)}%)
Flight: ${campaign.start_date} to ${campaign.end_date} (${campaign.kpis.days_remaining.toFixed(0)} days remaining)
Status: ${campaign.status} | Pacing: ${campaign.pacing_mode}
${campaign.notes ? `Notes: ${campaign.notes}` : ""}

Key Metrics:
- Pacing Index: ${campaign.kpis.pacing_index.toFixed(3)} (1.0 = on pace)
- Forecast Attainment: ${(campaign.kpis.forecast_attainment * 100).toFixed(1)}%
- Delivery to Goal: ${(campaign.kpis.delivery_pct * 100).toFixed(1)}%
- CTR: ${(campaign.kpis.ctr * 100).toFixed(2)}% (${campaign.kpis.ctr_delta >= 0 ? "+" : ""}${(campaign.kpis.ctr_delta * 100).toFixed(1)}% vs baseline)
- CVR: ${(campaign.kpis.cvr * 100).toFixed(2)}% (${campaign.kpis.cvr_delta >= 0 ? "+" : ""}${(campaign.kpis.cvr_delta * 100).toFixed(1)}% vs baseline)
- Avg CPC: $${campaign.kpis.avg_cpc.toFixed(2)} (${campaign.kpis.cpc_delta >= 0 ? "+" : ""}${(campaign.kpis.cpc_delta * 100).toFixed(1)}% vs baseline)
- ROAS: ${campaign.kpis.roas.toFixed(2)}x
- Share of Opportunities: ${(campaign.kpis.share_of_opps * 100).toFixed(1)}% (${campaign.kpis.share_of_opps_delta >= 0 ? "+" : ""}${(campaign.kpis.share_of_opps_delta * 100).toFixed(1)}% vs baseline)

Risk Assessment: ${campaign.severity.toUpperCase()} (score: ${campaign.risk_score}/100)
Root Causes: ${campaign.root_causes.join(", ") || "None identified"}
Current Issue: ${campaign.issue_summary}

Provide a 3-4 sentence analysis that:
1. Summarizes the campaign's current state and primary risk
2. Identifies the most likely root cause based on the KPI signals
3. Recommends the single highest-priority action the ops team should take right now
4. Notes any travel-specific considerations (availability, seasonality, booking windows)

Be direct, specific, and actionable. Use plain language an operations manager would understand.`;

    const systemPrompt = "You are a senior campaign operations analyst specializing in travel retail media at HTS Media. Provide concise, actionable analysis.";

    return {
      found: true,
      systemPrompt,
      userPrompt,
      fallback: this.generateFallbackAnalysis(campaign),
    };
  }

  private generateFallbackAnalysis(campaign: CampaignWithRisk): string {
    const parts: string[] = [];

    if (campaign.severity === "critical") {
      parts.push(
        `${campaign.name} is critically at risk of under-delivery with a pacing index of ${campaign.kpis.pacing_index.toFixed(2)} and only ${campaign.kpis.days_remaining.toFixed(0)} days remaining.`
      );
    } else if (campaign.severity === "warning") {
      parts.push(
        `${campaign.name} shows warning signs with pacing at ${(campaign.kpis.pacing_index * 100).toFixed(0)}% of plan and forecast attainment at ${(campaign.kpis.forecast_attainment * 100).toFixed(0)}%.`
      );
    } else {
      parts.push(
        `${campaign.name} is tracking well with a pacing index of ${campaign.kpis.pacing_index.toFixed(2)} and forecast attainment at ${(campaign.kpis.forecast_attainment * 100).toFixed(0)}%.`
      );
    }

    if (campaign.root_causes.length > 0) {
      parts.push(
        `The primary driver is ${campaign.root_causes[0].toLowerCase()}, which requires immediate attention.`
      );
    }

    if (campaign.recommended_actions.length > 0) {
      parts.push(
        `Priority action: ${campaign.recommended_actions[0].action} (expected impact: ${campaign.recommended_actions[0].impact}, timeline: ${campaign.recommended_actions[0].timeline}).`
      );
    }

    if (campaign.notes) {
      parts.push(`Note: ${campaign.notes}.`);
    }

    return parts.join(" ");
  }

  /**
   * Updates campaign fields. Only provided fields are updated.
   */
  async updateCampaign(
    id: string,
    updates: Partial<Omit<Campaign, "id" | "created_at">>
  ): Promise<CampaignWithRisk | null> {
    // Verify the campaign exists
    const existing = this.sql
      .exec<Campaign>("SELECT * FROM campaigns WHERE id = ?", id)
      .toArray();

    if (existing.length === 0) return null;

    // Build dynamic UPDATE statement from provided fields
    const allowedFields = [
      "name",
      "advertiser",
      "goal_type",
      "goal_value",
      "budget",
      "spend_to_date",
      "start_date",
      "end_date",
      "status",
      "pacing_mode",
      "notes",
      "owner",
      "impressions",
      "clicks",
      "bookings",
      "revenue",
      "cost",
      "opportunities",
      "baseline_ctr",
      "baseline_cvr",
      "baseline_cpc",
      "baseline_roas",
      "baseline_share_of_opps",
    ] as const;

    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const field of allowedFields) {
      if (field in updates && updates[field as keyof typeof updates] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(updates[field as keyof typeof updates]);
      }
    }

    if (setClauses.length === 0) {
      // No valid fields to update; return current state with risk
      const risk = computeRisk(existing[0]);
      return { ...existing[0], ...risk };
    }

    values.push(id);
    this.sql.exec(
      `UPDATE campaigns SET ${setClauses.join(", ")} WHERE id = ?`,
      ...values
    );

    // Return the updated campaign with risk
    const updated = this.sql
      .exec<Campaign>("SELECT * FROM campaigns WHERE id = ?", id)
      .toArray();

    if (updated.length === 0) return null;

    const risk = computeRisk(updated[0]);
    return { ...updated[0], ...risk };
  }
}

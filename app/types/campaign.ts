/**
 * Campaign type definitions that match the Durable Object return types.
 *
 * The DO's CampaignWithRisk flattens risk fields at the top level:
 *   { ...Campaign, severity, risk_score, root_causes, issue_summary, recommended_actions, kpis }
 */

export interface RecommendedAction {
  action: string;
  impact: "high" | "medium" | "low";
  timeline: string;
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

export interface CampaignWithRisk {
  // Campaign fields
  id: string;
  name: string;
  advertiser: string;
  goal_type: "IMP" | "CLK" | "BOOK" | "ROAS";
  goal_value: number;
  budget: number;
  spend_to_date: number;
  start_date: string;
  end_date: string;
  status: string;
  pacing_mode: string;
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

  // Risk assessment fields (flat, not nested)
  severity: "critical" | "warning" | "info" | "healthy";
  risk_score: number;
  root_causes: string[];
  issue_summary: string;
  recommended_actions: RecommendedAction[];

  // Computed KPIs (nested)
  kpis: KPIs;

  // AI analysis (optional, may be absent)
  ai_analysis?: string;
}

export type GoalType = CampaignWithRisk["goal_type"];
export type Severity = CampaignWithRisk["severity"];

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  IMP: "Impressions",
  CLK: "Clicks",
  BOOK: "Bookings",
  ROAS: "ROAS",
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  healthy: 3,
};

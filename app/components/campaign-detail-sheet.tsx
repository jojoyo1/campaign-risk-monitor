import { useFetcher } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { RiskBadge } from "~/components/risk-badge";
import { KpiCard } from "~/components/kpi-card";
import type { CampaignWithRisk, RecommendedAction } from "~/types/campaign";
import { GOAL_TYPE_LABELS } from "~/types/campaign";
import {
  formatCurrency,
  formatPct,
  formatDate,
  formatDelta,
  formatPacingIndex,
  formatRoas,
  formatCurrencyPrecise,
  formatCompact,
} from "~/lib/format";
import {
  CalendarIcon,
  UserIcon,
  TargetIcon,
  DollarSignIcon,
  SparklesIcon,
  AlertTriangleIcon,
  ZapIcon,
  ClockIcon,
  StickyNoteIcon,
  LoaderIcon,
  TagIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface CampaignDetailSheetProps {
  campaign: CampaignWithRisk | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ImpactBadge({ impact }: { impact: RecommendedAction["impact"] }) {
  const colors: Record<string, string> = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        colors[impact] ?? colors.low
      )}
    >
      {impact}
    </span>
  );
}

export function CampaignDetailSheet({
  campaign,
  open,
  onOpenChange,
}: CampaignDetailSheetProps) {
  const analyzeFetcher = useFetcher();
  const isAnalyzing = analyzeFetcher.state !== "idle";
  const analysisResult =
    analyzeFetcher.data &&
    typeof analyzeFetcher.data === "object" &&
    "analysis" in analyzeFetcher.data
      ? (analyzeFetcher.data as { analysis: string }).analysis
      : null;

  if (!campaign) return null;

  const aiAnalysis = analysisResult || campaign.ai_analysis;

  const handleAnalyze = () => {
    analyzeFetcher.submit(null, {
      method: "POST",
      action: `/api/campaigns/${campaign.id}/analyze`,
    });
  };

  const budgetPct =
    campaign.budget > 0
      ? ((campaign.spend_to_date / campaign.budget) * 100).toFixed(0)
      : "0";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[560px] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="space-y-1">
              <SheetTitle className="text-lg leading-tight">
                {campaign.name}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {campaign.advertiser}
              </SheetDescription>
            </div>
            <RiskBadge
              severity={campaign.severity}
              score={campaign.risk_score}
              showScore
              size="lg"
            />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 space-y-6">
            {/* Campaign Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                <span>
                  {formatDate(campaign.start_date)} -{" "}
                  {formatDate(campaign.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="size-3.5" />
                <span>{campaign.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TargetIcon className="size-3.5" />
                <span>
                  {GOAL_TYPE_LABELS[campaign.goal_type]} -{" "}
                  {formatCompact(campaign.goal_value)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSignIcon className="size-3.5" />
                <span>
                  {formatCurrency(campaign.spend_to_date)} /{" "}
                  {formatCurrency(campaign.budget)} ({budgetPct}%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon className="size-3.5" />
                <span>
                  {campaign.kpis.days_remaining} days remaining (
                  {campaign.kpis.days_elapsed} elapsed)
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-3.5" />
                <span className="capitalize">
                  {campaign.status} - {campaign.pacing_mode}
                </span>
              </div>
            </div>

            <Separator />

            {/* AI Analysis */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <SparklesIcon className="size-4 text-primary" />
                  AI Analysis
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <LoaderIcon className="size-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-3.5" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
              {aiAnalysis ? (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {aiAnalysis}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click "Analyze with AI" to get an intelligent analysis of
                    this campaign's performance and risks.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* KPI Cards Grid */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Key Performance Indicators
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <KpiCard
                  label="Pacing Index"
                  value={formatPacingIndex(campaign.kpis.pacing_index)}
                  subtitle={
                    campaign.kpis.pacing_index >= 0.95 &&
                    campaign.kpis.pacing_index <= 1.05
                      ? "On pace"
                      : campaign.kpis.pacing_index < 0.95
                      ? "Behind pace"
                      : "Ahead of pace"
                  }
                />
                <KpiCard
                  label="Forecast Attainment"
                  value={formatPct(campaign.kpis.forecast_attainment)}
                  subtitle={`Projected to deliver ${formatPct(campaign.kpis.forecast_attainment)} of goal`}
                />
                <KpiCard
                  label="Delivery to Goal"
                  value={formatPct(campaign.kpis.delivery_pct)}
                  subtitle={`${formatPct(campaign.kpis.time_elapsed_pct)} of time elapsed`}
                />
                <KpiCard
                  label="CTR"
                  value={`${(campaign.kpis.ctr * 100).toFixed(2)}%`}
                  delta={formatDelta(campaign.kpis.ctr_delta)}
                  positiveIsGood={true}
                />
                <KpiCard
                  label="CVR"
                  value={`${(campaign.kpis.cvr * 100).toFixed(2)}%`}
                  delta={formatDelta(campaign.kpis.cvr_delta)}
                  positiveIsGood={true}
                />
                <KpiCard
                  label="Avg CPC"
                  value={formatCurrencyPrecise(campaign.kpis.avg_cpc)}
                  delta={formatDelta(campaign.kpis.cpc_delta)}
                  positiveIsGood={false}
                />
                <KpiCard
                  label="ROAS"
                  value={formatRoas(campaign.kpis.roas)}
                  delta={formatDelta(campaign.kpis.roas_delta)}
                  positiveIsGood={true}
                />
                <KpiCard
                  label="Share of Opportunities"
                  value={formatPct(campaign.kpis.share_of_opps)}
                  delta={formatDelta(campaign.kpis.share_of_opps_delta)}
                  positiveIsGood={true}
                />
              </div>
            </div>

            <Separator />

            {/* Root Causes */}
            {campaign.root_causes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <AlertTriangleIcon className="size-4 text-amber-500" />
                  Root Causes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.root_causes.map((cause, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {cause}
                    </Badge>
                  ))}
                </div>
                {campaign.issue_summary && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {campaign.issue_summary}
                  </p>
                )}
              </div>
            )}

            {/* Recommended Actions */}
            {campaign.recommended_actions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                    <ZapIcon className="size-4 text-primary" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-2">
                    {campaign.recommended_actions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-tight">
                            {action.action}
                          </p>
                          <div className="flex items-center gap-2">
                            <ImpactBadge impact={action.impact} />
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <ClockIcon className="size-2.5" />
                              {action.timeline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {campaign.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <StickyNoteIcon className="size-4 text-muted-foreground" />
                    Campaign Notes
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {campaign.notes}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

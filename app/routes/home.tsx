import { useState, useMemo } from "react";
import type { Route } from "./+types/home";
import { data, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { SummaryStats } from "~/components/summary-stats";
import { Filters } from "~/components/filters";
import { CampaignTable } from "~/components/campaign-table";
import { CampaignDetailSheet } from "~/components/campaign-detail-sheet";
import type { CampaignWithRisk } from "~/types/campaign";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  ShieldAlertIcon,
  DatabaseIcon,
  LoaderIcon,
  PlaneIcon,
  InfoIcon,
  ExternalLinkIcon,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Campaign Risk Monitor - HTS Media" },
    {
      name: "description",
      content: "Monitor and manage travel campaign risk in real-time",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const id = context.cloudflare.env.CAMPAIGN_DO.idFromName("global");
  const stub = context.cloudflare.env.CAMPAIGN_DO.get(id);

  let campaigns: unknown[] = [];
  try {
    campaigns = await stub.listCampaigns();
  } catch {
    // DO may not be initialized yet
    campaigns = [];
  }

  // Auto-seed if empty
  if (campaigns.length === 0) {
    try {
      await stub.seedData();
      campaigns = await stub.listCampaigns();
    } catch {
      // Seeding failed, show empty state
      campaigns = [];
    }
  }

  return data({ campaigns });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const campaigns = loaderData.campaigns as CampaignWithRisk[];
  const seedFetcher = useFetcher();
  const isSeeding = seedFetcher.state !== "idle";

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignWithRisk | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [goalTypeFilter, setGoalTypeFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");

  // Derive unique owners for the filter dropdown
  const owners = useMemo(() => {
    const unique = [...new Set(campaigns.map((c) => c.owner))];
    return unique.sort();
  }, [campaigns]);

  // Apply severity, goalType, and owner filters before passing to table
  // (search/global filter is handled by the table component itself)
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (severityFilter !== "all" && c.severity !== severityFilter) {
        return false;
      }
      if (goalTypeFilter !== "all" && c.goal_type !== goalTypeFilter) {
        return false;
      }
      if (ownerFilter !== "all" && c.owner !== ownerFilter) {
        return false;
      }
      return true;
    });
  }, [campaigns, severityFilter, goalTypeFilter, ownerFilter]);

  const handleRowClick = (campaign: CampaignWithRisk) => {
    setSelectedCampaign(campaign);
    setSheetOpen(true);
  };

  const handleSeed = () => {
    seedFetcher.submit(null, {
      method: "POST",
      action: "/api/seed",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
                <ShieldAlertIcon className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Campaign Risk Monitor
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <PlaneIcon className="size-3" />
                  HTS Media - Travel Campaign Operations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {campaigns.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeed}
                  disabled={isSeeding}
                >
                  {isSeeding ? (
                    <>
                      <LoaderIcon className="size-3.5 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <DatabaseIcon className="size-3.5" />
                      Seed Data
                    </>
                  )}
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <InfoIcon className="size-3.5" />
                    What am I looking at?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[540px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg">What am I looking at?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p className="text-foreground font-medium">
                      A prototype early-detection system for travel media campaigns at risk of under-delivery.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">1.</span>
                        <p><span className="text-foreground font-medium">KPI-driven risk detection</span> — 10 core metrics across delivery, engagement, conversion, efficiency, and pacing are computed in real-time. Pacing Index and Forecast Attainment drive severity classification (Critical / Warning / Info / Healthy) using threshold rules calibrated to goal type (IMP, CLK, BOOK, ROAS).</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">2.</span>
                        <p><span className="text-foreground font-medium">Root cause diagnosis &amp; recommended actions</span> — When a signal fires, the system identifies why (e.g. CTR decline, inventory constraint, conversion drop, cost inflation) and maps each root cause to a specific remediation with expected impact and timeline — drawn from a travel-media-specific intervention framework.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-semibold shrink-0">3.</span>
                        <p><span className="text-foreground font-medium">Operations-first UI</span> — A portfolio-level table sorted by risk, one-click drill-down into any campaign, and an AI analyst that synthesizes all signals into plain-language next steps. Built for campaign ops managers who need to triage fast.</p>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                      <p className="text-foreground font-medium text-xs uppercase tracking-wider">Under the hood</p>
                      <p>
                        The risk model, linear forecasting engine, goal-type-specific threshold queries, and recommended action generator all live in a single backend file. The AI analysis layer uses these computed signals as context for LLM-powered campaign diagnosis.
                      </p>
                      <div className="flex flex-col gap-1 pt-1">
                        <a
                          href="https://github.com/jojoyo1/campaign-risk-monitor"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                        >
                          <ExternalLinkIcon className="size-3" />
                          View full source on GitHub
                        </a>
                        <a
                          href="https://github.com/jojoyo1/campaign-risk-monitor/blob/main/workers/campaign-do.ts"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                        >
                          <ExternalLinkIcon className="size-3" />
                          campaign-do.ts — forecasting, AI prompts, SQL &amp; threshold logic
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Stats */}
        <SummaryStats campaigns={campaigns} />

        {/* Filters */}
        <Filters
          search={search}
          onSearchChange={setSearch}
          severity={severityFilter}
          onSeverityChange={setSeverityFilter}
          goalType={goalTypeFilter}
          onGoalTypeChange={setGoalTypeFilter}
          owner={ownerFilter}
          onOwnerChange={setOwnerFilter}
          owners={owners}
        />

        {/* Table */}
        {filteredCampaigns.length > 0 || search ? (
          <CampaignTable
            campaigns={filteredCampaigns}
            onRowClick={handleRowClick}
            globalFilter={search}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 px-4">
            <DatabaseIcon className="size-10 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-1">
              No campaigns yet
            </h2>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Seed the database with sample campaign data to get started with
              the risk monitor.
            </p>
            <Button onClick={handleSeed} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <LoaderIcon className="size-3.5 animate-spin" />
                  Seeding data...
                </>
              ) : (
                <>
                  <DatabaseIcon className="size-3.5" />
                  Seed Demo Data
                </>
              )}
            </Button>
          </div>
        )}
      </main>

      {/* Campaign Detail Sheet */}
      <CampaignDetailSheet
        campaign={selectedCampaign}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

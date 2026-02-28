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
  ShieldAlertIcon,
  DatabaseIcon,
  LoaderIcon,
  PlaneIcon,
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

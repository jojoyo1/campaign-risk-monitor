import { cn } from "~/lib/utils";
import type { CampaignWithRisk } from "~/types/campaign";
import {
  LayoutDashboardIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
} from "lucide-react";

interface SummaryStatsProps {
  campaigns: CampaignWithRisk[];
  className?: string;
}

export function SummaryStats({ campaigns, className }: SummaryStatsProps) {
  const total = campaigns.length;
  const critical = campaigns.filter(
    (c) => c.severity === "critical"
  ).length;
  const warning = campaigns.filter(
    (c) => c.severity === "warning"
  ).length;
  const healthy = campaigns.filter(
    (c) => c.severity === "healthy" || c.severity === "info"
  ).length;

  const stats = [
    {
      label: "Total Campaigns",
      value: total,
      icon: LayoutDashboardIcon,
      color: "text-foreground",
      bg: "bg-secondary",
    },
    {
      label: "Critical",
      value: critical,
      icon: AlertCircleIcon,
      color: "text-red-700",
      bg: "bg-red-50",
    },
    {
      label: "Warning",
      value: warning,
      icon: AlertTriangleIcon,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Healthy",
      value: healthy,
      icon: CheckCircle2Icon,
      color: "text-green-700",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3",
              stat.bg
            )}
          >
            <Icon className={cn("size-5 shrink-0", stat.color)} />
            <div>
              <div className={cn("text-2xl font-bold tracking-tight", stat.color)}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

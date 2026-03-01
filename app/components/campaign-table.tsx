import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Progress } from "~/components/ui/progress";
import { RiskBadge } from "~/components/risk-badge";
import type { CampaignWithRisk } from "~/types/campaign";
import {
  formatCurrency,
  formatCompact,
  formatPct,
  formatDateShort,
  formatPacingIndex,
} from "~/lib/format";
import {
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface CampaignTableProps {
  campaigns: CampaignWithRisk[];
  onRowClick: (campaign: CampaignWithRisk) => void;
  globalFilter: string;
}

function PacingIndicator({ value }: { value: number }) {
  let color = "text-green-600 bg-green-50";
  if (value < 0.8) {
    color = "text-red-600 bg-red-50";
  } else if (value < 0.95) {
    color = "text-amber-600 bg-amber-50";
  } else if (value > 1.1) {
    color = "text-blue-600 bg-blue-50";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        color
      )}
    >
      {formatPacingIndex(value)}
    </span>
  );
}

function GoalTypeBadge({ type }: { type: CampaignWithRisk["goal_type"] }) {
  const colors: Record<string, string> = {
    IMP: "bg-purple-50 text-purple-700 border-purple-200",
    CLK: "bg-sky-50 text-sky-700 border-sky-200",
    BOOK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ROAS: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        colors[type]
      )}
    >
      {type}
    </span>
  );
}

export function CampaignTable({
  campaigns,
  onRowClick,
  globalFilter,
}: CampaignTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "risk_score", desc: true },
  ]);

  const columns = useMemo<ColumnDef<CampaignWithRisk, unknown>[]>(
    () => [
      {
        id: "risk_score",
        accessorFn: (row) => row.risk_score,
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Risk
              {sorted === "asc" ? (
                <ArrowUpIcon className="size-3.5" />
              ) : sorted === "desc" ? (
                <ArrowDownIcon className="size-3.5" />
              ) : (
                <ArrowUpDownIcon className="size-3.5 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <RiskBadge
              severity={row.original.severity}
              score={row.original.risk_score}
              showScore
              size="sm"
            />
          </div>
        ),
        size: 120,
      },
      {
        id: "campaign",
        accessorFn: (row) => `${row.name} ${row.advertiser}`,
        header: () => (
          <span>
            Campaign{" "}
            <span className="text-[10px] font-normal text-muted-foreground/70">
              (click for details)
            </span>
          </span>
        ),
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <div className="font-medium text-foreground leading-tight">
              {row.original.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.advertiser}
            </div>
          </div>
        ),
        size: 200,
      },
      {
        id: "goal",
        accessorFn: (row) => row.kpis.delivery_pct,
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Goal
              {sorted === "asc" ? (
                <ArrowUpIcon className="size-3.5" />
              ) : sorted === "desc" ? (
                <ArrowDownIcon className="size-3.5" />
              ) : (
                <ArrowUpDownIcon className="size-3.5 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const campaign = row.original;
          const deliveryPct = Math.min(campaign.kpis.delivery_pct * 100, 100);
          return (
            <div className="min-w-[140px] space-y-1">
              <div className="flex items-center gap-1.5">
                <GoalTypeBadge type={campaign.goal_type} />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatCompact(campaign.goal_value)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={deliveryPct} className="h-1.5 flex-1" />
                <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                  {formatPct(campaign.kpis.delivery_pct)}
                </span>
              </div>
            </div>
          );
        },
        size: 180,
      },
      {
        id: "budget",
        accessorFn: (row) => row.spend_to_date / row.budget,
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Budget
              {sorted === "asc" ? (
                <ArrowUpIcon className="size-3.5" />
              ) : sorted === "desc" ? (
                <ArrowDownIcon className="size-3.5" />
              ) : (
                <ArrowUpDownIcon className="size-3.5 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const campaign = row.original;
          const spendPct =
            campaign.budget > 0
              ? (campaign.spend_to_date / campaign.budget) * 100
              : 0;
          return (
            <div className="min-w-[100px]">
              <div className="text-xs tabular-nums">
                <span className="font-medium">
                  {formatCurrency(campaign.spend_to_date)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {formatCurrency(campaign.budget)}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums">
                {spendPct.toFixed(0)}% used
              </div>
            </div>
          );
        },
        size: 140,
      },
      {
        id: "pacing",
        accessorFn: (row) => row.kpis.pacing_index,
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          return (
            <button
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Pacing
              {sorted === "asc" ? (
                <ArrowUpIcon className="size-3.5" />
              ) : sorted === "desc" ? (
                <ArrowDownIcon className="size-3.5" />
              ) : (
                <ArrowUpDownIcon className="size-3.5 opacity-50" />
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <PacingIndicator value={row.original.kpis.pacing_index} />
        ),
        size: 80,
      },
      {
        id: "flight",
        accessorFn: (row) => row.kpis.days_remaining,
        header: "Flight",
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="size-3" />
                <span className="tabular-nums">
                  {formatDateShort(campaign.start_date)} -{" "}
                  {formatDateShort(campaign.end_date)}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums">
                {campaign.kpis.days_remaining} days left
              </div>
            </div>
          );
        },
        size: 140,
      },
      {
        id: "issue",
        accessorFn: (row) => row.issue_summary,
        header: "Issue",
        cell: ({ row }) => (
          <div className="min-w-[160px] max-w-[240px]">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {row.original.issue_summary || "No issues detected"}
            </p>
          </div>
        ),
        size: 220,
        enableSorting: false,
      },
      {
        id: "action",
        accessorFn: (row) =>
          row.recommended_actions?.[0]?.action ?? "",
        header: "Action",
        cell: ({ row }) => {
          const firstAction = row.original.recommended_actions?.[0];
          if (!firstAction) {
            return (
              <span className="text-xs text-muted-foreground">--</span>
            );
          }
          const impactColors: Record<string, string> = {
            high: "bg-red-50 text-red-700 border-red-200",
            medium: "bg-amber-50 text-amber-700 border-amber-200",
            low: "bg-slate-50 text-slate-600 border-slate-200",
          };
          return (
            <div className="min-w-[140px] max-w-[200px] space-y-1">
              <p className="text-xs line-clamp-1">{firstAction.action}</p>
              <span
                className={cn(
                  "inline-flex items-center rounded border px-1 py-0.5 text-[10px] font-medium",
                  impactColors[firstAction.impact] ?? impactColors.low
                )}
              >
                {firstAction.impact} impact
              </span>
            </div>
          );
        },
        size: 180,
        enableSorting: false,
      },
      {
        id: "owner",
        accessorFn: (row) => row.owner,
        header: "Owner",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 min-w-[80px]">
            <UserIcon className="size-3 text-muted-foreground" />
            <span className="text-xs">{row.original.owner}</span>
          </div>
        ),
        size: 100,
      },
    ],
    []
  );

  const table = useReactTable({
    data: campaigns,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const campaign = row.original;
      return (
        campaign.name.toLowerCase().includes(search) ||
        campaign.advertiser.toLowerCase().includes(search) ||
        campaign.owner.toLowerCase().includes(search)
      );
    },
  });

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No campaigns found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

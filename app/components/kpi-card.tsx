import { cn } from "~/lib/utils";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: {
    text: string;
    isPositive: boolean;
    isNegative: boolean;
  };
  subtitle?: string;
  /** Whether a positive delta is good (true) or bad (false). Default true. */
  positiveIsGood?: boolean;
  className?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  subtitle,
  positiveIsGood = true,
  className,
}: KpiCardProps) {
  const getDeltaColor = () => {
    if (!delta) return "";
    if (delta.isPositive) {
      return positiveIsGood ? "text-green-600" : "text-red-600";
    }
    if (delta.isNegative) {
      return positiveIsGood ? "text-red-600" : "text-green-600";
    }
    return "text-muted-foreground";
  };

  const getDeltaIcon = () => {
    if (!delta) return null;
    if (delta.isPositive) return TrendingUpIcon;
    if (delta.isNegative) return TrendingDownIcon;
    return MinusIcon;
  };

  const DeltaIcon = getDeltaIcon();

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 text-card-foreground",
        className
      )}
    >
      <div className="text-xs font-medium text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      {delta && (
        <div className={cn("flex items-center gap-1 mt-1 text-xs", getDeltaColor())}>
          {DeltaIcon && <DeltaIcon className="size-3" />}
          <span>{delta.text} vs baseline</span>
        </div>
      )}
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
      )}
    </div>
  );
}

import { cn } from "~/lib/utils";
import type { Severity } from "~/types/campaign";
import {
  AlertTriangleIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircle2Icon,
} from "lucide-react";

const severityConfig: Record<
  Severity,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  critical: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: AlertCircleIcon,
  },
  warning: {
    label: "Warning",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: AlertTriangleIcon,
  },
  info: {
    label: "Info",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: InfoIcon,
  },
  healthy: {
    label: "Healthy",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: CheckCircle2Icon,
  },
};

interface RiskBadgeProps {
  severity: Severity;
  score?: number;
  showScore?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function RiskBadge({
  severity,
  score,
  showScore = false,
  size = "default",
  className,
}: RiskBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium",
        config.bg,
        config.text,
        config.border,
        size === "sm" && "px-1.5 py-0.5 text-xs",
        size === "default" && "px-2 py-0.5 text-xs",
        size === "lg" && "px-2.5 py-1 text-sm",
        className
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "sm" && "size-3",
          size === "default" && "size-3.5",
          size === "lg" && "size-4"
        )}
      />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75">({score})</span>
      )}
    </span>
  );
}

/**
 * A compact dot indicator for tight table cells.
 */
export function RiskDot({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block size-2.5 rounded-full",
        severity === "critical" && "bg-red-500",
        severity === "warning" && "bg-amber-500",
        severity === "info" && "bg-blue-500",
        severity === "healthy" && "bg-green-500",
        className
      )}
    />
  );
}

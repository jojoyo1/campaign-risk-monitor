import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SearchIcon } from "lucide-react";
import type { Severity, GoalType } from "~/types/campaign";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  goalType: string;
  onGoalTypeChange: (value: string) => void;
  owner: string;
  onOwnerChange: (value: string) => void;
  owners: string[];
}

export function Filters({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  goalType,
  onGoalTypeChange,
  owner,
  onOwnerChange,
  owners,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={severity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severity</SelectItem>
          <SelectItem value="critical">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500" />
              Critical
            </span>
          </SelectItem>
          <SelectItem value="warning">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              Warning
            </span>
          </SelectItem>
          <SelectItem value="info">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              Info
            </span>
          </SelectItem>
          <SelectItem value="healthy">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" />
              Healthy
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={goalType} onValueChange={onGoalTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Goal Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Goals</SelectItem>
          <SelectItem value="IMP">Impressions</SelectItem>
          <SelectItem value="CLK">Clicks</SelectItem>
          <SelectItem value="BOOK">Bookings</SelectItem>
          <SelectItem value="ROAS">ROAS</SelectItem>
        </SelectContent>
      </Select>

      <Select value={owner} onValueChange={onOwnerChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Owners</SelectItem>
          {owners.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

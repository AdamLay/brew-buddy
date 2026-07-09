import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useBatches } from "@/lib/batches/use-batches";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isDateInBatch(day: Date, batch: { startDate: string; endDate: string | null }): boolean {
  const start = new Date(batch.startDate);
  start.setHours(0, 0, 0, 0);
  day.setHours(0, 0, 0, 0);
  if (day < start) return false;
  if (batch.endDate) {
    const end = new Date(batch.endDate);
    end.setHours(0, 0, 0, 0);
    if (day > end) return false;
  }
  return true;
}

function getMonthGrid(year: number, month: number) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const days: { date: Date; inMonth: boolean }[] = [];

  let currentDate = new Date(year, month, 1 - startPadding);
  const totalCells = Math.ceil((startPadding + lastDay.getDate()) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(currentDate);
    cellDate.setDate(currentDate.getDate() + i);
    days.push({
      date: cellDate,
      inMonth: cellDate.getMonth() === month,
    });
  }

  return days;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { day: "numeric" });
}

const brewTypeColors: Record<string, string> = {
  CIDER: "badge-warning",
  WINE: "badge-secondary",
  BEER: "badge-accent",
  OTHER: "badge-ghost",
};

// ── Day cell ───────────────────────────────────────────────────────────

function DayCell({
  date,
  inMonth,
  batches,
  isToday,
}: {
  date: Date;
  inMonth: boolean;
  batches: {
    startDate: string;
    endDate: string | null;
    recipe: { name: string; brewType: string };
    id: string;
    status: string;
  }[];
  isToday: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const maxShow = 3;

  return (
    <div
      className={`min-h-[60px] xs:min-h-[80px] sm:min-h-[100px] p-0.5 xs:p-1 sm:p-1.5 border rounded-lg transition-colors ${
        inMonth
          ? "border-base-200 bg-base-100 hover:bg-base-200/50"
          : "border-base-200/50 bg-base-100/30"
      }`}
    >
      <div className="flex items-center justify-between px-0.5 xs:px-1">
        <span
          className={`text-[10px] xs:text-xs sm:text-sm font-medium ${
            isToday
              ? "bg-primary text-primary-content rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center"
              : inMonth
                ? "text-base-content"
                : "text-base-content/30"
          }`}
        >
          {formatDate(date)}
        </span>
      </div>

      <div className="space-y-0.5">
        {batches.map((batch, i) => {
          const showMore = !expanded && i === maxShow;
          const hidden = !expanded && i >= maxShow;

          return (
            <div key={batch.id} className={hidden ? "hidden" : ""}>
              {showMore ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setExpanded(true);
                  }}
                  className="text-[9px] xs:text-[10px] text-base-content/50 hover:text-base-content cursor-pointer w-full text-left p-0.5"
                >
                  +{batches.length - maxShow} more
                </button>
              ) : (
                <Link
                  to="/batches/$id"
                  params={{ id: batch.id }}
                  className={`block text-[9px] xs:text-[10px] truncate rounded px-0.5 xs:px-1 py-px border ${brewTypeColors[batch.recipe.brewType] || "badge-ghost"} bg-opacity-10 hover:opacity-80 min-h-[16px] xs:min-h-[20px]`}
                >
                  <span className="font-medium">{batch.recipe.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Month Navigation ───────────────────────────────────────────────────

function MonthNav({
  year,
  month,
  onPrev,
  onNext,
  onToday,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">{monthName}</h2>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onToday} className="btn btn-ghost btn-sm btn-sm min-w-0 px-2">
          Today
        </button>
        <button
          onClick={onNext}
          className="btn btn-ghost btn-sm btn-square"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Calendar ──────────────────────────────────────────────────────

export function BatchCalendar() {
  const { data: batches, isLoading } = useBatches();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const grid = useMemo(() => getMonthGrid(currentYear, currentMonth), [currentYear, currentMonth]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <MonthNav
        year={currentYear}
        month={currentMonth}
        onPrev={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}
        onNext={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}
        onToday={() => setViewDate(new Date())}
      />

      <div className="grid grid-cols-7 gap-px bg-base-300 rounded-xl overflow-hidden border border-base-300">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="bg-base-200 text-base-content/60 text-xs font-semibold py-2 text-center"
          >
            {name}
          </div>
        ))}

        {grid.map(({ date, inMonth }: { date: Date; inMonth: boolean }) => {
          const dateStr = date.toISOString().split("T")[0];
          const dayBatches = batches?.filter((b) => isDateInBatch(date, b)) ?? [];

          return (
            <DayCell
              key={dateStr}
              date={date}
              inMonth={inMonth}
              batches={dayBatches}
              isToday={
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              }
            />
          );
        })}
      </div>
    </div>
  );
}

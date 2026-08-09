"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils/format";
import type {
  DailySummary,
  MonthlySummary,
  TransactionSummary,
} from "@/lib/types/transaction";
import {
  useChartTypeFilter,
  useChartRangeFilter,
  type ChartRange,
  type ChartTypeFilter,
} from "@/hooks/transactions/useChartTypeFilter";

interface BalanceCardProps {
  compact?: boolean;
  summary?: TransactionSummary | null;
  byMonth?: MonthlySummary[];
  byDay?: DailySummary[];
}

const INCOME_COLOR = "var(--color-leaf-500)";
const EXPENSE_COLOR = "var(--color-gold-500)";

const MONTH_LABEL = new Intl.DateTimeFormat("es-MX", {
  month: "short",
});

const MONTH_YEAR_LABEL = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
});

const DAY_LABEL = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

const DAY_TOOLTIP_LABEL = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const COMPACT_CURRENCY = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  notation: "compact",
  maximumFractionDigits: 1,
});

interface ChartPoint {
  key: string;
  date: Date;
  label: string;
  income: number;
  expense: number;
}

function buildMonthPoints(
  byMonth: MonthlySummary[],
  months: number,
): ChartPoint[] {
  const byKey = new Map(byMonth.map((item) => [item.month, item]));

  const points: ChartPoint[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const item = byKey.get(key);
    points.push({
      key,
      date,
      label: MONTH_LABEL.format(date),
      income: item?.income ?? 0,
      expense: item?.expense ?? 0,
    });
  }

  return points;
}

function buildDayPoints(byDay: DailySummary[], days: number): ChartPoint[] {
  const byKey = new Map(byDay.map((item) => [item.day, item]));

  const points: ChartPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const item = byKey.get(key);
    points.push({
      key,
      date,
      label: DAY_LABEL.format(date),
      income: item?.income ?? 0,
      expense: item?.expense ?? 0,
    });
  }

  return points;
}

function niceCeil(value: number): number {
  if (value <= 0) return 0;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

const RANGE_OPTIONS: Array<{
  value: ChartRange;
  label: string;
  labelFull: string;
}> = [
  { value: "6m", label: "6M", labelFull: "Últimos 6 meses" },
  { value: "3m", label: "3M", labelFull: "Últimos 3 meses" },
  { value: "30d", label: "30D", labelFull: "Últimos 30 días" },
  { value: "7d", label: "7D", labelFull: "Últimos 7 días" },
];

const FILTER_OPTIONS: Array<{ value: ChartTypeFilter | null; label: string }> =
  [
    { value: null, label: "Todo" },
    { value: "income", label: "Ingresos" },
    { value: "expense", label: "Gastos" },
  ];

function BalanceCardChart({
  byMonth,
  byDay,
}: {
  byMonth: MonthlySummary[];
  byDay: DailySummary[];
}) {
  const { chartType, setChartType } = useChartTypeFilter();
  const { range, setRange } = useChartRangeFilter();

  const points = useMemo(() => {
    if (range === "30d") return buildDayPoints(byDay, 30);
    if (range === "7d") return buildDayPoints(byDay, 7);
    return buildMonthPoints(byMonth, range === "3m" ? 3 : 6);
  }, [range, byMonth, byDay]);

  const rangeLabel =
    RANGE_OPTIONS.find((option) => option.value === range)?.labelFull ??
    "Últimos 6 meses";

  const isDaily = range === "30d" || range === "7d";

  const maxValue = Math.max(
    0,
    ...points.map((point) =>
      chartType === "income"
        ? point.income
        : chartType === "expense"
          ? point.expense
          : Math.max(point.income, point.expense),
    ),
  );
  const scaleMax = niceCeil(maxValue) || 1;

  const viewWidth = 600;
  const viewHeight = 200;
  const padding = { top: 14, right: 58, bottom: 26, left: 10 };
  const plotWidth = viewWidth - padding.left - padding.right;
  const plotHeight = viewHeight - padding.top - padding.bottom;

  const xFor = (index: number) =>
    padding.left + (index / (points.length - 1)) * plotWidth;
  const yFor = (value: number) =>
    padding.top + plotHeight - (value / scaleMax) * plotHeight;

  const gridSteps = [0, 0.25, 0.5, 0.75, 1];

  const series: Array<{
    type: "income" | "expense";
    color: string;
    label: string;
  }> =
    chartType === "income"
      ? [{ type: "income", color: INCOME_COLOR, label: "Ingresos" }]
      : chartType === "expense"
        ? [{ type: "expense", color: EXPENSE_COLOR, label: "Gastos" }]
        : [
            { type: "income", color: INCOME_COLOR, label: "Ingresos" },
            { type: "expense", color: EXPENSE_COLOR, label: "Gastos" },
          ];

  const showXLabel = (index: number) =>
    isDaily
      ? index % 5 === 0 || index === points.length - 1
      : true;

  const tooltipLabel = (point: ChartPoint) =>
    isDaily
      ? DAY_TOOLTIP_LABEL.format(point.date)
      : MONTH_YEAR_LABEL.format(point.date);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 dark:text-ink/40">
          {rangeLabel}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex rounded-lg border border-paper/15 p-0.5 dark:border-ink/15"
            role="group"
            aria-label="Periodo de la gráfica"
          >
            {RANGE_OPTIONS.map((option) => {
              const active = range === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-white/15 text-paper dark:bg-white/10 dark:text-ink"
                      : "text-paper/50 hover:text-paper dark:text-ink/50 dark:hover:text-ink"
                  }`}
                  aria-pressed={active}
                  onClick={() => setRange(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div
            className="flex rounded-lg border border-paper/15 p-0.5 dark:border-ink/15"
            role="group"
            aria-label="Filtrar gráfica"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = chartType === option.value;
              return (
                <button
                  key={option.label}
                  type="button"
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-white/15 text-paper dark:bg-white/10 dark:text-ink"
                      : "text-paper/50 hover:text-paper dark:text-ink/50 dark:hover:text-ink"
                  }`}
                  aria-pressed={active}
                  onClick={() => setChartType(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="mt-3 w-full"
        role="img"
        aria-label={`Gráfica de líneas de ingresos y gastos — ${rangeLabel}`}
      >
        {gridSteps.map((step) => {
          const y = padding.top + plotHeight * (1 - step);
          const value = scaleMax * step;
          return (
            <g key={step}>
              <line
                x1={padding.left}
                x2={viewWidth - padding.right}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray={step === 0 ? undefined : "3 4"}
              />
              <text
                x={viewWidth - padding.right + 6}
                y={y + 3}
                textAnchor="start"
                className="fill-paper/40 dark:fill-ink/40"
                style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              >
                {step === 0 ? "0" : COMPACT_CURRENCY.format(value)}
              </text>
            </g>
          );
        })}

        {series.map(({ type, color, label }) => (
          <g key={type}>
            <polyline
              points={points
                .map((point, index) => `${xFor(index)},${yFor(point[type])}`)
                .join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={point.key}
                cx={xFor(index)}
                cy={yFor(point[type])}
                r="3"
                fill={color}
              >
                <title>{`${tooltipLabel(point)} — ${label}: ${formatCurrency(point[type])}`}</title>
              </circle>
            ))}
          </g>
        ))}

        {points.map((point, index) =>
          showXLabel(index) ? (
            <text
              key={point.key}
              x={xFor(index)}
              y={viewHeight - 8}
              textAnchor="middle"
              className="fill-paper/40 dark:fill-ink/40"
              style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
            >
              {point.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export function BalanceCard({
  compact = false,
  summary,
  byMonth,
  byDay,
}: BalanceCardProps) {
  const netBalance = summary?.netBalance ?? 24830.4;
  const totalIncome = summary?.totalIncome ?? 3120.5;
  const totalExpenses = summary?.totalExpenses ?? 2158;

  return (
    <div className="rounded-2xl bg-ink p-5 text-paper shadow-xl shadow-ink/15 sm:p-6 dark:bg-[#18221d] dark:text-ink dark:shadow-black/30">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50 dark:text-ink/50">
        Saldo total
      </p>
      <p
        className={`mt-2 font-mono font-semibold tracking-tight ${compact ? "text-2xl" : "text-3xl xl:text-4xl"}`}
      >
        {formatCurrency(netBalance)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper/10 pt-4 font-mono text-xs dark:border-ink/10">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-leaf-500" />
          <span className="text-leaf-500">+{formatCurrency(totalIncome)}</span>
          <span className="text-paper/40 dark:text-ink/40">ingresos</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-gold-500" />
          <span className="text-gold-500">-{formatCurrency(totalExpenses)}</span>
          <span className="text-paper/40 dark:text-ink/40">gastos</span>
        </span>
      </div>
      {!compact ? (
        byMonth && byDay ? (
          <div className="mt-5">
            <BalanceCardChart byMonth={byMonth} byDay={byDay} />
          </div>
        ) : (
          <div
            className="mt-5 h-55 animate-pulse rounded-lg bg-white/5"
            aria-hidden="true"
          />
        )
      ) : null}
    </div>
  );
}

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
  mock?: boolean;
  summary?: TransactionSummary | null;
  byMonth?: MonthlySummary[];
  byDay?: DailySummary[];
}

const MOCK_NET_BALANCE = 24830.4;
const MOCK_TOTAL_INCOME = 3120.5;
const MOCK_TOTAL_EXPENSES = 2158;

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

// Formato determinista: evita hydration mismatch entre el ICU de Node (server)
// y el del navegador (client), que producen strings distintos ("$1.3 k" vs "1.3 k$")
function formatCompactCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  let scaled = Math.abs(value);
  let suffix = "";
  if (scaled >= 1_000_000) {
    scaled /= 1_000_000;
    suffix = " M";
  } else if (scaled >= 1_000) {
    scaled /= 1_000;
    suffix = " k";
  }
  const text =
    scaled >= 100
      ? Math.round(scaled).toString()
      : scaled.toFixed(1).replace(/\.0$/, "");
  return `${sign}$${text}${suffix}`;
}

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

function mockValue(seed: number, base: number, amplitude: number): number {
  const wave =
    Math.sin(seed * 1.1) * 0.5 + Math.sin(seed * 2.7 + 1.3) * 0.5;
  return Math.max(0, Math.round((base + wave * amplitude) * 100) / 100);
}

function buildMockPoints(range: ChartRange): ChartPoint[] {
  const now = new Date();
  const isDaily = range === "30d" || range === "7d";
  const count = isDaily ? (range === "30d" ? 30 : 7) : range === "3m" ? 3 : 6;

  const points: ChartPoint[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const date = isDaily
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - (count - 1 - i))
      : new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    const key = isDaily
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    points.push({
      key,
      date,
      label: isDaily ? DAY_LABEL.format(date) : MONTH_LABEL.format(date),
      income: mockValue(seed, 3800, 1600),
      expense: mockValue(seed, 2600, 1200),
    });
  }

  return points;
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

interface RangeOptionButtonProps {
  option: (typeof RANGE_OPTIONS)[number];
  active: boolean;
  onClick: () => void;
}

function RangeOptionButton({ option, active, onClick }: RangeOptionButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
        active
          ? "bg-white/15 text-paper dark:bg-white/10 dark:text-ink"
          : "text-paper/50 hover:text-paper dark:text-ink/50 dark:hover:text-ink"
      }`}
      aria-pressed={active}
      onClick={onClick}
    >
      {option.label}
    </button>
  );
}

interface ChartRangeOptionsProps {
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
}

function ChartRangeOptions({ range, onRangeChange }: ChartRangeOptionsProps) {
  return (
    <div
      className="flex rounded-lg border border-paper/15 p-0.5 dark:border-ink/15"
      role="group"
      aria-label="Periodo de la gráfica"
    >
      {RANGE_OPTIONS.map((option) => (
        <RangeOptionButton
          key={option.value}
          option={option}
          active={range === option.value}
          onClick={() => onRangeChange(option.value)}
        />
      ))}
    </div>
  );
}

interface FilterOptionButtonProps {
  option: (typeof FILTER_OPTIONS)[number];
  active: boolean;
  onClick: () => void;
}

function FilterOptionButton({ option, active, onClick }: FilterOptionButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        active
          ? "bg-white/15 text-paper dark:bg-white/10 dark:text-ink"
          : "text-paper/50 hover:text-paper dark:text-ink/50 dark:hover:text-ink"
      }`}
      aria-pressed={active}
      onClick={onClick}
    >
      {option.label}
    </button>
  );
}

interface ChartFilterOptionsProps {
  chartType: ChartTypeFilter | null;
  onChartTypeChange: (type: ChartTypeFilter | null) => void;
}

function ChartFilterOptions({
  chartType,
  onChartTypeChange,
}: ChartFilterOptionsProps) {
  return (
    <div
      className="flex rounded-lg border border-paper/15 p-0.5 dark:border-ink/15"
      role="group"
      aria-label="Filtrar gráfica"
    >
      {FILTER_OPTIONS.map((option) => (
        <FilterOptionButton
          key={option.label}
          option={option}
          active={chartType === option.value}
          onClick={() => onChartTypeChange(option.value)}
        />
      ))}
    </div>
  );
}

interface GridLineProps {
  step: number;
  y: number;
  value: number;
  x1: number;
  x2: number;
}

function GridLine({ step, y, value, x1, x2 }: GridLineProps) {
  return (
    <g>
      <line
        x1={x1}
        x2={x2}
        y1={y}
        y2={y}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray={step === 0 ? undefined : "3 4"}
      />
      <text
        x={x2 + 6}
        y={y + 3}
        textAnchor="start"
        className="fill-paper/40 dark:fill-ink/40"
        style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        {step === 0 ? "0" : formatCompactCurrency(value)}
      </text>
    </g>
  );
}

interface ChartGridLinesProps {
  gridSteps: number[];
  padding: { top: number; right: number; bottom: number; left: number };
  viewWidth: number;
  scaleMax: number;
  plotHeight: number;
}

function ChartGridLines({
  gridSteps,
  padding,
  viewWidth,
  scaleMax,
  plotHeight,
}: ChartGridLinesProps) {
  return (
    <>
      {gridSteps.map((step) => (
        <GridLine
          key={step}
          step={step}
          y={padding.top + plotHeight * (1 - step)}
          value={scaleMax * step}
          x1={padding.left}
          x2={viewWidth - padding.right}
        />
      ))}
    </>
  );
}

interface ChartPointProps {
  cx: number;
  cy: number;
  color: string;
  tooltip: string;
}

function ChartPoint({ cx, cy, color, tooltip }: ChartPointProps) {
  return (
    <circle cx={cx} cy={cy} r="3" fill={color}>
      <title>{tooltip}</title>
    </circle>
  );
}

interface ChartSeriesGroupProps {
  series: Array<{
    type: "income" | "expense";
    color: string;
    label: string;
  }>;
  points: ChartPoint[];
  mock: boolean;
  xFor: (index: number) => number;
  yFor: (value: number) => number;
  tooltipLabel: (point: ChartPoint) => string;
}

function ChartSeriesGroup({
  series,
  points,
  mock,
  xFor,
  yFor,
  tooltipLabel,
}: ChartSeriesGroupProps) {
  return (
    <>
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
            className={mock ? "mock-chart-line" : undefined}
          />
          {mock ? (
            <polyline
              points={points
                .map((point, index) => `${xFor(index)},${yFor(point[type])}`)
                .join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
              className="mock-chart-flow"
            />
          ) : null}
          {points.map((point, index) => (
            <ChartPoint
              key={point.key}
              cx={xFor(index)}
              cy={yFor(point[type])}
              color={color}
              tooltip={`${tooltipLabel(point)} — ${label}: ${formatCurrency(point[type])}`}
            />
          ))}
        </g>
      ))}
    </>
  );
}

interface XAxisLabelProps {
  x: number;
  y: number;
  label: string;
}

function XAxisLabel({ x, y, label }: XAxisLabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-paper/40 dark:fill-ink/40"
      style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
    >
      {label}
    </text>
  );
}

interface ChartXLabelsProps {
  points: ChartPoint[];
  xFor: (index: number) => number;
  y: number;
  isDaily: boolean;
}

function ChartXLabels({ points, xFor, y, isDaily }: ChartXLabelsProps) {
  return (
    <>
      {points.map((point, index) =>
        isDaily
          ? index % 5 === 0 || index === points.length - 1 ? (
              <XAxisLabel key={point.key} x={xFor(index)} y={y} label={point.label} />
            ) : null
          : (
              <XAxisLabel key={point.key} x={xFor(index)} y={y} label={point.label} />
            ),
      )}
    </>
  );
}

function BalanceCardChart({
  byMonth,
  byDay,
  mock = false,
  hideIncome = false,
  hideExpense = false,
}: {
  byMonth: MonthlySummary[];
  byDay: DailySummary[];
  mock?: boolean;
  hideIncome?: boolean;
  hideExpense?: boolean;
}) {
  const { chartType, setChartType } = useChartTypeFilter();
  const { range, setRange } = useChartRangeFilter();

  const points = useMemo(() => {
    if (mock) return buildMockPoints(range);
    if (range === "30d") return buildDayPoints(byDay, 30);
    if (range === "7d") return buildDayPoints(byDay, 7);
    return buildMonthPoints(byMonth, range === "3m" ? 3 : 6);
  }, [range, byMonth, byDay, mock]);

  const rangeLabel =
    RANGE_OPTIONS.find((option) => option.value === range)?.labelFull ??
    "Últimos 6 meses";

  const isDaily = range === "30d" || range === "7d";

  const series: Array<{
    type: "income" | "expense";
    color: string;
    label: string;
  }> =
    chartType === "income"
      ? hideIncome
        ? []
        : [{ type: "income", color: INCOME_COLOR, label: "Ingresos" }]
      : chartType === "expense"
        ? hideExpense
          ? []
          : [{ type: "expense", color: EXPENSE_COLOR, label: "Gastos" }]
        : [
            ...(hideIncome
              ? []
              : [{ type: "income" as const, color: INCOME_COLOR, label: "Ingresos" }]),
            ...(hideExpense
              ? []
              : [{ type: "expense" as const, color: EXPENSE_COLOR, label: "Gastos" }]),
          ];

  const visibleTypes = series.map((item) => item.type);

  const maxValue = Math.max(
    0,
    ...points.map((point) =>
      visibleTypes.includes("income") && visibleTypes.includes("expense")
        ? Math.max(point.income, point.expense)
        : visibleTypes.includes("income")
          ? point.income
          : visibleTypes.includes("expense")
            ? point.expense
            : 0,
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
        {mock ? null : (
          <div className="flex flex-wrap items-center gap-2">
            <ChartRangeOptions range={range} onRangeChange={setRange} />
            <ChartFilterOptions
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>
        )}
      </div>

      <svg
        key={mock ? `${range}-${chartType}` : undefined}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="mt-3 w-full"
        role="img"
        aria-label={`Gráfica de líneas de ingresos y gastos — ${rangeLabel}`}
      >
        <ChartGridLines
          gridSteps={gridSteps}
          padding={padding}
          viewWidth={viewWidth}
          scaleMax={scaleMax}
          plotHeight={plotHeight}
        />

        <ChartSeriesGroup
          series={series}
          points={points}
          mock={mock}
          xFor={xFor}
          yFor={yFor}
          tooltipLabel={tooltipLabel}
        />

        <ChartXLabels
          points={points}
          xFor={xFor}
          y={viewHeight - 8}
          isDaily={isDaily}
        />
      </svg>
    </div>
  );
}

export function BalanceCard({
  compact = false,
  mock = false,
  summary,
  byMonth,
  byDay,
}: BalanceCardProps) {
  const hasData = Boolean(summary) || mock;
  const showChart = !compact || mock;

  const netBalance = mock ? MOCK_NET_BALANCE : summary?.netBalance;
  const totalIncome = mock ? MOCK_TOTAL_INCOME : summary?.totalIncome;
  const totalExpenses = mock ? MOCK_TOTAL_EXPENSES : summary?.totalExpenses;

  return (
    <div className="rounded-2xl bg-ink p-5 text-paper shadow-xl shadow-ink/15 sm:p-6 dark:bg-[#18221d] dark:text-ink dark:shadow-black/30">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50 dark:text-ink/50">
        Saldo total
      </p>

      {hasData ? (
        <p
          className={`mt-2 font-mono font-semibold tracking-tight ${compact ? "text-2xl" : "text-3xl xl:text-4xl"}`}
        >
          {formatCurrency(netBalance ?? 0)}
        </p>
      ) : (
        <div
          className="mt-2.5 h-9 w-44 animate-pulse rounded-md bg-white/10 dark:bg-ink/10"
          aria-hidden="true"
        />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper/10 pt-4 font-mono text-xs dark:border-ink/10">
        {hasData ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-leaf-500" />
              <span className="text-leaf-500">+{formatCurrency(totalIncome ?? 0)}</span>
              <span className="text-paper/40 dark:text-ink/40">ingresos</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-gold-500" />
              <span className="text-gold-500">-{formatCurrency(totalExpenses ?? 0)}</span>
              <span className="text-paper/40 dark:text-ink/40">gastos</span>
            </span>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div
              className="h-4 w-28 animate-pulse rounded bg-white/10 dark:bg-ink/10"
              aria-hidden="true"
            />
            <div
              className="h-4 w-28 animate-pulse rounded bg-white/10 dark:bg-ink/10"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {showChart ? (
        byMonth && byDay ? (
          <div className="mt-5">
            <BalanceCardChart
              hideIncome={totalIncome === 0}
              hideExpense={totalExpenses === 0}
              byMonth={byMonth}
              byDay={byDay}
            />
          </div>
        ) : mock ? (
          <div className="mt-5">
            <BalanceCardChart mock byMonth={[]} byDay={[]} />
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

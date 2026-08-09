"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ChartTypeFilter = "income" | "expense";

export function parseChartType(value: string | null): ChartTypeFilter | null {
  return value === "income" || value === "expense" ? value : null;
}

export function useChartTypeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useMemo(
    () => searchParams ?? new URLSearchParams(),
    [searchParams],
  );

  const chartType = useMemo(
    () => parseChartType(params.get("chart")),
    [params],
  );

  const setChartType = useCallback(
    (next: ChartTypeFilter | null) => {
      const urlParams = new URLSearchParams(params.toString());
      if (next) urlParams.set("chart", next);
      else urlParams.delete("chart");

      const query = urlParams.toString();
      const url = pathname ?? "/";
      router.replace(query ? `${url}?${query}` : url, { scroll: false });
    },
    [params, router, pathname],
  );

  return { chartType, setChartType };
}

export type ChartRange = "6m" | "3m" | "30d" | "7d";

export const DEFAULT_CHART_RANGE: ChartRange = "6m";

export function parseChartRange(value: string | null): ChartRange | null {
  return value === "3m" || value === "30d" || value === "7d"
    ? value
    : value === "6m"
      ? value
      : null;
}

export function useChartRangeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useMemo(
    () => searchParams ?? new URLSearchParams(),
    [searchParams],
  );

  const range = useMemo(
    () => parseChartRange(params.get("range")) ?? DEFAULT_CHART_RANGE,
    [params],
  );

  const setRange = useCallback(
    (next: ChartRange) => {
      const urlParams = new URLSearchParams(params.toString());
      if (next !== DEFAULT_CHART_RANGE) urlParams.set("range", next);
      else urlParams.delete("range");

      const query = urlParams.toString();
      const url = pathname ?? "/";
      router.replace(query ? `${url}?${query}` : url, { scroll: false });
    },
    [params, router, pathname],
  );

  return { range, setRange };
}

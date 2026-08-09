"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  TRANSACTION_PERIODS,
  type TransactionCategory,
  type TransactionPeriod,
  type TransactionSortBy,
  type TransactionType,
} from "@/lib/types/transaction";

export interface TransactionFiltersState {
  type: TransactionType | "";
  category: TransactionCategory | "";
  period: TransactionPeriod | "";
  sortBy: TransactionSortBy;
  order: "asc" | "desc";
  page: number;
  limit: number;
}

export const DEFAULT_TRANSACTION_FILTERS: TransactionFiltersState = {
  type: "",
  category: "",
  period: "",
  sortBy: "date",
  order: "desc",
  page: 1,
  limit: 10,
};

function parseType(value: string | null): TransactionType | "" {
  return value === "income" || value === "expense" ? value : "";
}

function parseCategory(value: string | null): TransactionCategory | "" {
  return value ? (value as TransactionCategory) : "";
}

function parsePeriod(value: string | null): TransactionPeriod | "" {
  return (TRANSACTION_PERIODS as readonly string[]).includes(value ?? "")
    ? (value as TransactionPeriod)
    : "";
}

function parseSortBy(value: string | null): TransactionSortBy {
  return value === "amount" ? "amount" : "date";
}

function parseOrder(value: string | null): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

function parsePage(value: string | null): number {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

export function useTransactionUrlFilters(pageSize: number) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useMemo(
    () => searchParams ?? new URLSearchParams(),
    [searchParams],
  );

  const filters: TransactionFiltersState = useMemo(
    () => ({
      type: parseType(params.get("type")),
      category: parseCategory(params.get("category")),
      period: parsePeriod(params.get("period")),
      sortBy: parseSortBy(params.get("sortBy")),
      order: parseOrder(params.get("order")),
      page: parsePage(params.get("page")),
      limit: pageSize,
    }),
    [params, pageSize],
  );

  const updateFilters = useCallback(
    (patch: Partial<TransactionFiltersState>) => {
      const next = { ...filters, ...patch };

      const resetsPage =
        "type" in patch ||
        "category" in patch ||
        "period" in patch ||
        "sortBy" in patch ||
        "order" in patch;
      if (resetsPage) next.page = 1;

      const urlParams = new URLSearchParams(params.toString());
      const write = (key: string, value: string, defaultValue: string) => {
        if (value !== defaultValue) urlParams.set(key, value);
        else urlParams.delete(key);
      };

      write("type", next.type, "");
      write("category", next.category, "");
      write("period", next.period, "");
      write("sortBy", next.sortBy, "date");
      write("order", next.order, "desc");
      write("page", String(next.page), "1");

      const query = urlParams.toString();
      const url = pathname ?? "/";
      router.replace(query ? `${url}?${query}` : url, {
        scroll: false,
      });
    },
    [filters, params, router, pathname],
  );

  return { filters, updateFilters };
}

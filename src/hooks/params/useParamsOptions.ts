"use client";

import { useMemo } from "react";
import { useParams } from "./queries/useParams";
import {
  CATEGORY_LABELS,
  PERIOD_LABELS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_PERIODS,
  TRANSACTION_TYPES,
  TYPE_LABELS,
} from "@/lib/types/transaction";
import type { ParamCategory, ParamOption } from "@/lib/types/params";

export function useParamsOptions() {
  const { data: params } = useParams();

  const types = useMemo<ParamOption[]>(() => {
    if (params?.types?.length) return params.types;
    return TRANSACTION_TYPES.map((value) => ({
      value,
      label: TYPE_LABELS[value],
    }));
  }, [params]);

  const categories = useMemo<ParamCategory[]>(() => {
    if (params?.categories?.length) return params.categories;
    return TRANSACTION_CATEGORIES.map((key) => ({
      key,
      name: CATEGORY_LABELS[key],
      type: key === "salary" ? "income" : "expense",
    }));
  }, [params]);

  const periods = useMemo<ParamOption[]>(() => {
    if (params?.periods?.length) return params.periods;
    return TRANSACTION_PERIODS.map((value) => ({
      value,
      label: PERIOD_LABELS[value],
    }));
  }, [params]);

  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const category of categories) labels[category.key] = category.name;
    return labels;
  }, [categories]);

  return { types, categories, periods, categoryLabels };
}

import type { CategoryType } from "./category";

export interface ParamCategory {
  key: string;
  name: string;
  type: CategoryType;
}

export interface ParamOption {
  value: string;
  label: string;
}

export interface ParamsModel {
  categories: ParamCategory[];
  types: ParamOption[];
  periods: ParamOption[];
}

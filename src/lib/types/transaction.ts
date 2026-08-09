export const TRANSACTION_TYPES = ["income", "expense"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_CATEGORIES = [
  "salary",
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "shopping",
  "other",
] as const;
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  salary: "Salario",
  food: "Comida",
  transport: "Transporte",
  housing: "Vivienda",
  entertainment: "Entretenimiento",
  health: "Salud",
  shopping: "Compras",
  other: "Otros",
};

export const TYPE_LABELS: Record<TransactionType, string> = {
  income: "Ingreso",
  expense: "Gasto",
};

export type TransactionSortBy = "date" | "amount";
export type SortOrder = "asc" | "desc";

export const TRANSACTION_PERIODS = ["7d", "30d", "3m", "6m"] as const;
export type TransactionPeriod = (typeof TRANSACTION_PERIODS)[number];

export const PERIOD_LABELS: Record<TransactionPeriod, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "3m": "Últimos 3 meses",
  "6m": "Últimos 6 meses",
};

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

export interface DailySummary {
  day: string;
  income: number;
  expense: number;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionSummaryResponse {
  summary: TransactionSummary;
  byMonth: MonthlySummary[];
  byDay: DailySummary[];
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  period?: TransactionPeriod;
  sortBy?: TransactionSortBy;
  order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface TransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date?: string;
}

export interface CreateTransactionResponse {
  code: string;
  message: string;
  transaction: Transaction;
}

export interface UpdateTransactionResponse {
  code: string;
  message: string;
  transaction: Transaction;
}

export interface DeleteTransactionResponse {
  code: string;
  message: string;
}

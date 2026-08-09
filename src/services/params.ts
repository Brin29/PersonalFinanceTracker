import { apiClient } from "../lib/api/client";
import type { ParamsModel } from "../lib/types/params";

export async function getParams(): Promise<ParamsModel> {
  const response = await apiClient.get<ParamsModel>("/params");
  return response.data;
}

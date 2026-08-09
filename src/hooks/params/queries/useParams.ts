import { useQuery } from "@tanstack/react-query";
import { getParams } from "@/services/params";
import { paramsKeys } from "../params.keys";

export function useParams() {
  return useQuery({
    queryKey: paramsKeys.all,
    queryFn: getParams,
  });
}

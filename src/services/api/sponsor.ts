import { SponsorBalanceResponse } from "@/app/api/sponsor/balance/route";
import { genericFetcher } from "@/services/api";
import useSWR from "swr";

export function useSponsorBalance() {
  const route = `/api/sponsor/balance`;
  const { data, error, isLoading } = useSWR<SponsorBalanceResponse, any, any>(
    route,
    genericFetcher
  );
  return {
    data,
    isLoading,
    isError: error,
  };
}

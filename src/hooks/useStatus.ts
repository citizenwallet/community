"use client";

import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useStatus() {
  const apicall = `/api/status`;
  const { data, error, isLoading } = useSWR(apicall, fetcher);
  return {
    status: data,
    isLoading,
    isError: error,
  };
}

import React, { Suspense } from "react";
import System, { StatusItem } from "@/containers/System";
import ManagePaymasterTemplate from "@/templates/ManagePaymaster";
import { isIndexerRunning } from "@/services/indexer";
import { isAppRunning } from "@/services/app";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items: StatusItem[] = [
    { id: "dashboard", label: "Dashboard", ok: true },
    { id: "indexer", label: "Indexer", ok: isIndexerRunning() },
    { id: "bundler", label: "Bundler", ok: isIndexerRunning() },
    { id: "wallet", label: "Wallet", ok: isAppRunning() },
  ];

  return (
    <Suspense fallback={<ManagePaymasterTemplate />}>
      <System items={items} />
    </Suspense>
  );
}

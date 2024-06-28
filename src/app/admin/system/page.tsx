import React, { Suspense } from "react";
import System, { StatusItem } from "@/containers/System";
import ManagePaymasterTemplate from "@/templates/ManagePaymaster";
import { isIndexerRunning } from "@/services/indexer";
import { isAppRunning } from "@/services/app";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items: StatusItem[] = [
    { label: "Dashboard", ok: true },
    { label: "Indexer", ok: isIndexerRunning() },
    { label: "Bundler", ok: isIndexerRunning() },
    { label: "Wallet", ok: isAppRunning() },
  ];

  return (
    <Suspense fallback={<ManagePaymasterTemplate />}>
      <System items={items} />
    </Suspense>
  );
}

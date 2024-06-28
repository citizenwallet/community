// app/api/server
import { VERSION } from "@/constants/version";
import { downloadApp, startApp } from "@/services/app";
import { getDashboardVersion, readCommunityFile } from "@/services/community";
import { downloadDashboard, startDashboard } from "@/services/dashboard";
import { downloadIndexer, startIndexer } from "@/services/indexer";
import { compareSemver } from "@/utils/semver";

export async function PATCH() {
  try {
    // get the latest version of the dashboard
    const version = await getDashboardVersion();

    const hasUpdate = compareSemver(VERSION, version) === -1;
    if (!hasUpdate) {
      return Response.json({ message: "No update available" }, { status: 412 });
    }

    const community = readCommunityFile();
    if (!community) {
      return Response.json(
        { message: "Community file not found" },
        { status: 500 }
      );
    }

    // update the app
    downloadApp();

    startApp();

    // update the indexer
    downloadIndexer();

    startIndexer(community.node.chain_id);

    // update the dashboard itself
    downloadDashboard();

    startDashboard();

    return Response.json({}, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

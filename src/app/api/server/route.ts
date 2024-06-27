// app/api/configure
import { VERSION } from "@/constants/version";
import {
  getDashboardVersion,
  updateCommunityServer,
} from "@/services/community";
import { compareSemver } from "@/utils/semver";

export async function PATCH() {
  try {
    const version = await getDashboardVersion();

    const hasUpdate = compareSemver(VERSION, version) === -1;
    if (!hasUpdate) {
      return Response.json({ message: "No update available" }, { status: 412 });
    }

    await updateCommunityServer();

    return Response.json({}, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

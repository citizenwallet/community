// app/api/configure/indexer
import { appFolderExists, createAppFolder } from "@/services/community";
import {
  downloadApp,
  isAppCompiled,
  isAppRunning,
  startApp,
} from "@/services/app";

export async function POST(req: Request) {
  try {
    const appIsRunning = isAppRunning();
    if (appIsRunning) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    if (!appFolderExists()) {
      createAppFolder();
    }

    downloadApp();

    startApp();

    return Response.json({}, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

// app/api/configure/indexer
import {
  appFolderExists,
  createAppFolder,
  downloadApp,
} from "@/services/community";
import {
  dockerComposeCompileApp,
  dockerComposeIsAppCompiled,
} from "@/services/cw";

export async function POST(req: Request) {
  try {
    const appIsCompiled = await dockerComposeIsAppCompiled();
    if (appIsCompiled) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    if (!appFolderExists()) {
      createAppFolder();
    }

    downloadApp();

    return Response.json({}, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

// app/api/configure/indexer
import { appFolderExists, createAppFolder } from "@/services/community";
import {
  dockerComposeCompileApp,
  dockerComposeIsAppCompiled,
} from "@/services/cw";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const appIsCompiled = await dockerComposeIsAppCompiled();
    if (appIsCompiled) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    if (!appFolderExists()) {
      createAppFolder();
    }

    await Promise.race([
      dockerComposeCompileApp(),
      new Promise<void>((resolve, _) => setTimeout(() => resolve(), 2000)),
    ]);

    return Response.json({} as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

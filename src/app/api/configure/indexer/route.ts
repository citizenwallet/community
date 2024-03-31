// app/api/configure/indexer
import { dockerComposeUpIndexer, dockerIsIndexerUp } from "@/services/cw";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const indexerIsRunning = await dockerIsIndexerUp();
    if (indexerIsRunning) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    await Promise.race([
      dockerComposeUpIndexer(),
      new Promise<void>((resolve, _) => setTimeout(() => resolve(), 5000)),
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

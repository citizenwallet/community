import { execPromise } from "@/utils/exec";
import { execSync } from "child_process";
import { v2 as compose } from "docker-compose";
import { existsSync } from "fs";
import path from "path";

export const dockerComposeUpIndexer = async () => {
  await execPromise("docker compose up indexer --build -d");
};

export const dockerIsIndexerUp = async () => {
  const { out, err } = await compose.ps({
    cwd: path.join(process.cwd()),
    log: true,
  });

  // Split the output into lines
  const lines = out.split("\n");

  // Find the line that contains the 'indexer' service name
  const indexerLine = lines.find((line) => line.includes("indexer"));

  // Check if the 'indexer' service is up
  const isIndexerUp = indexerLine && indexerLine.includes("Up");

  return isIndexerUp;
};

export const isAppCompiled = async () => {
  const filePath = path.join(process.cwd(), ".community/web/index.html");
  return existsSync(filePath);
};

import { execPromise } from "@/utils/exec";
import { execSync, spawn } from "child_process";
import { v2 as compose } from "docker-compose";
import { existsSync } from "fs";
import path from "path";

export const dockerComposeUpIndexer = () => {
  spawn("docker compose up indexer --build -d", {
    detached: true,
    shell: true,
    stdio: "ignore",
  });
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

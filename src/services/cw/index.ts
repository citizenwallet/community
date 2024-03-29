import { v2 as compose } from "docker-compose";
import { existsSync } from "fs";
import path from "path";

export const dockerComposeUpIndexer = async () => {
  await compose.upOne("indexer", {
    cwd: path.join(process.cwd()),
    log: true,
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

export const dockerComposeCompileApp = async () => {
  await compose.upOne("compile-app", {
    cwd: path.join(process.cwd()),
    log: true,
  });
};

export const dockerComposeIsAppCompiled = async () => {
  const filePath = path.join(process.cwd(), ".community/web/index.html");
  return existsSync(filePath);
};

export const dockerComposeUpApp = async () => {
  await compose.upOne("app", {
    cwd: path.join(process.cwd()),
    log: true,
  });
};

export const dockerIsAppUp = async () => {
  const { out, err } = await compose.ps({
    cwd: path.join(process.cwd()),
    log: true,
  });

  // Split the output into lines
  const lines = out.split("\n");

  // Find the line that contains the 'compile-app' service name
  const appLine = lines.find((line) => line.includes("app"));

  // Check if the 'compile-app' service is up
  const isAppUp = appLine && appLine.includes("Up");

  return isAppUp;
};

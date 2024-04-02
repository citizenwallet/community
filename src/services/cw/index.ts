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

export const dockerComposeCompileApp = async () => {
  execSync("rm -rf .community/web/*");

  const response = await fetch(
    `${process.env.BUILD_OUTPUT_URL}/web/${process.env.BUILD_VERSION_FILE_NAME}`
  );

  if (response.status !== 200) {
    throw new Error("Error fetching version file");
  }

  const version = (await response.text()).trim();

  execSync(
    `curl -o .community/web/app.tar.gz -L ${process.env.BUILD_OUTPUT_URL}/web/cw_web_${version}.tar.gz`
  );

  execSync("tar -xvf .community/web/app.tar.gz -C .community/web");

  execSync("rm -rf .community/web/app.tar.gz");
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

  // Find the line that contains the 'app' service name
  const appLine = lines.find((line) => line.includes("app"));

  // Check if the 'app' service is up
  const isAppUp = appLine && appLine.includes("Up");

  return isAppUp;
};

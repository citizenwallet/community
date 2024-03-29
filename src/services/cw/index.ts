import { v2 as compose } from "docker-compose";
import path from "path";

export const dockerComposeUpIndexer = async () => {
  await compose.upOne("indexer", {
    cwd: path.join(process.cwd()),
    log: true,
  });
};

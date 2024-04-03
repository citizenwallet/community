import { v2 as compose } from "docker-compose";
import sqlite3 from "sqlite3";
import { Network } from "@citizenwallet/sdk";
import { spawn } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { JsonRpcProvider } from "ethers";

export const completeIndexerEnv = (network: Network) => {
  let env = readFileSync(".env.indexer.example", "utf8");

  env = env.replace("<chain_rpc_url>", network.rpcUrl);
  env = env.replace("<chain_ws_rpc_url>", network.wsRpcUrl);

  const filePath = path.join(process.cwd(), ".env.indexer");
  return writeFileSync(filePath, env);
};

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

export const prepareDB = async (
  network: Network,
  decimals: number,
  token: string,
  tokenName: string,
  tokenSymbol: string,
  paymaster: string,
  encryptedPrivateKey: string
) => {
  if (existsSync(path.join(process.cwd(), ".community/data/cw.db"))) {
    return;
  }

  const provider = new JsonRpcProvider(network.rpcUrl);

  const block = await provider.getBlockNumber();

  const currentDate = new Date().toISOString();

  const db = new sqlite3.Database(
    path.join(process.cwd(), ".community/data/cw.db")
  );

  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS t_events_${network.chainId}(
            contract text NOT NULL,
            state text NOT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            start_block integer NOT NULL,
            last_block integer NOT NULL,
            standard text NOT NULL,
            name text NOT NULL,
            symbol text NOT NULL,
            decimals integer NOT NULL DEFAULT ${decimals},
            UNIQUE (contract, standard)
        );
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_events_${network.chainId}_state ON t_events_${network.chainId}(state);
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_events_${network.chainId}_address_signature ON t_events_${network.chainId}(contract, standard);
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_events_${network.chainId}_address_signature_state ON t_events_${network.chainId}(contract, standard, state);
    `);

    db.run(
      `
        INSERT INTO t_events_${network.chainId}(contract, state, created_at, updated_at, start_block, last_block, standard, name, symbol, decimals)
            VALUES (?, 'indexed', ?, ?, ?, ?, 'ERC20', ?, ?, ?);
    `,
      [
        token,
        currentDate,
        currentDate,
        block,
        block,
        tokenName,
        tokenSymbol,
        decimals,
      ]
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS t_sponsors_${network.chainId}(
            contract text NOT NULL PRIMARY KEY,
            pk text NOT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.run(
      `
        INSERT INTO t_sponsors_${network.chainId}(contract, pk, created_at, updated_at)
            VALUES (?, ?, ?, ?);
    `,
      [paymaster, encryptedPrivateKey, currentDate, currentDate]
    );
  });
};

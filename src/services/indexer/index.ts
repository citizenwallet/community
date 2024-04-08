import sqlite3 from "sqlite3";
import { Network } from "@citizenwallet/sdk";
import { execSync, spawn } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { JsonRpcProvider } from "ethers";
import { getSystemInfo } from "@/utils/system";

export const completeIndexerEnv = (network: Network) => {
  let env = readFileSync(".env.indexer.example", "utf8");

  env = env.replace("<chain_rpc_url>", network.rpcUrl);
  env = env.replace("<chain_ws_rpc_url>", network.wsRpcUrl);

  const filePath = path.join(process.cwd(), ".env.indexer");
  return writeFileSync(filePath, env);
};

export const indexerProcessId = (): string | undefined => {
  try {
    const command = "sudo lsof -i :3001 -t";
    const pid = execSync(command).toString().trim();

    return pid;
  } catch (error) {
    return undefined;
  }
};

export const startIndexer = (chainId: number) => {
  stopIndexer();

  let chainEVM = "ethereum";
  switch (chainId) {
    case 8453:
      chainEVM = "celo";
      break;
    case 84532:
      chainEVM = "celo";
      break;
    case 42220:
      chainEVM = "celo";
      break;
    case 44787:
      chainEVM = "celo";
      break;
  }

  spawn(
    `${process.cwd()}/.community/indexer/indexer -evm ${chainEVM} -env ${process.cwd()}/.env.indexer -port 3001 -dbpath ${process.cwd()}/.community -fbpath ${process.cwd()}/.community/config/firebase.json -ws`,
    {
      detached: true,
      shell: true,
      stdio: "ignore",
    }
  );
};

export const stopIndexer = () => {
  const pid = indexerProcessId();
  if (!pid) {
    return;
  }

  execSync(`kill ${pid}`);
};

export const isIndexerRunning = () => {
  const pid = indexerProcessId();

  return !!pid;
};

export const downloadIndexer = () => {
  // clean up the indexer folder
  execSync(`rm -rf ${process.cwd()}/.community/indexer/*`);

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  execSync(
    `curl -H 'Cache-Control: no-cache' -o ${process.cwd()}/.community/${buildVersionFileName}-indexer -L ${buildOutputUrl}/indexer/${buildVersionFileName}?cache_buster=$(date +%s) > /dev/null 2>&1`
  );

  const buildVersion = readFileSync(
    `${process.cwd()}/.community/${buildVersionFileName}-indexer`,
    "utf8"
  ).replace(/\r?\n|\r/g, "");

  const { systemOS, systemArch } = getSystemInfo();

  // download the indexer
  execSync(
    `curl -o ${process.cwd()}/.community/indexer/indexer -L ${buildOutputUrl}/indexer/indexer_${systemOS}_${systemArch}_${buildVersion} > /dev/null 2>&1`
  );
};

export const isIndexerDownloaded = async () => {
  const filePath = path.join(process.cwd(), ".community/indexer/indexer");
  return existsSync(filePath);
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
    // clean up the db folder
    execSync(`rm -rf ${process.cwd()}/.community/data/*`);
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

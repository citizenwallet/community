import { readFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { spawn } from "child_process";
import qrcode from "qrcode-terminal";
import { config } from "dotenv";
import { communityFileExists, communityHashExists } from "@/services/community";

function execPromise(command: string, verbose = false) {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args);

    if (verbose) {
      child.stdout.on("data", (data) => {
        console.log(data.toString());
      });
    }

    if (verbose) {
      child.stderr.on("data", (data) => {
        console.error(data.toString());
      });
    }

    child.on("error", (error) => {
      console.log(error.message);
      reject(error);
    });

    child.on("exit", (code, signal) => {
      if (code !== 0) {
        const err = new Error(
          `Process exited with code: ${code}, signal: ${signal}`
        );
        console.log(`error: ${err.message}`);
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function prepareApp() {
  config();

  term.nextLine(1);
  let cursor = term.saveCursor();
  cursor("App: compiling...");
  const spinner = await term.spinner("dotSpinner");

  // clean up the web folder
  await execPromise("rm -rf .community/web/*");

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  await execPromise(
    `curl -H 'Cache-Control: no-cache' -o .community/${buildVersionFileName}-web -L ${buildOutputUrl}/web/${buildVersionFileName}?cache_buster=$(date +%s)`
  );

  // download the app
  await execPromise(`BUILD_VERSION=$(cat .community/${buildVersionFileName}-web) && \
  curl -o app.tar.gz -L ${buildOutputUrl}/web/cw_web_${buildVersionFileName}.tar.gz && \
  tar -xvf app.tar.gz -C .community/web`);

  spinner.animate(false);
  cursor.eraseLine();
  cursor.column(1);
  cursor("App: compiled ✅\n");
}

// Purpose: Start the application.
async function main() {
  term.clear();

  const logo = readFileSync("./assets/cw.ans", "utf8");

  term(logo);

  term.nextLine(2);

  term.bold("Citizen Wallet - Community Server\n");

  // TODO: when we need more automation, adding these steps would be helpful

  // TODO: check if .env files exist
  // TODO: if !exists >> prep .env files for nginx and community
  // TODO: check if certs exist
  // TODO: if !exists >> ask for host name
  // TODO: if !exists >> generate SSL certs
  // TODO: if !exists >> stop containers

  // stop all containers
  await execPromise("docker compose down");

  // start nginx
  term.nextLine(2);
  let cursor = term.saveCursor();
  cursor("Server: starting...");
  let spinner = await term.spinner("dotSpinner");
  await execPromise("docker compose up server --build -d");
  spinner.animate(false);
  cursor.eraseLine();
  cursor.column(1);
  cursor("Server: started ✅\n");

  const communityExists = communityFileExists();
  const hashExists = communityHashExists();
  if (communityExists && hashExists) {
    // start indexer
    term.nextLine(1);
    cursor = term.saveCursor();
    cursor("Indexer: starting...");
    spinner = await term.spinner("dotSpinner");
    await execPromise("docker compose up indexer --build -d");
    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("Indexer: started ✅\n");

    // app
    await prepareApp();
  }

  // compile community
  term.nextLine(1);
  cursor = term.saveCursor();
  cursor("Community: compiling...");
  spinner = await term.spinner("dotSpinner");
  await execPromise("npm run build");
  spinner.animate(false);
  cursor.eraseLine();
  cursor.column(1);
  cursor("Community: compiled ✅\n");

  // start community
  term.nextLine(1);
  cursor = term.saveCursor();
  cursor("Community: starting...");
  spinner = await term.spinner("dotSpinner");
  spawn("npx next start -H 0.0.0.0", {
    detached: true,
    shell: true,
    stdio: "ignore",
  });
  spinner.animate(false);
  cursor.eraseLine();
  cursor.column(1);
  cursor("Community: started ✅\n");

  // parse .env
  config();

  // display url
  term.nextLine(2);
  term.bold("Community URL\n");
  term.nextLine(2);
  qrcode.generate(
    `https://${process.env.NGINX_HOST}${process.env.NEXT_PUBLIC_BASE_PATH}`
  );
  term.nextLine(1);
  term.underline(
    `https://${process.env.NGINX_HOST}${process.env.NEXT_PUBLIC_BASE_PATH}`
  );
  term.nextLine(2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

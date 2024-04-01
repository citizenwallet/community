import os from "os";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { spawn } from "child_process";
import qrcode from "qrcode-terminal";
import { config } from "dotenv";
import {
  communityFileExists,
  communityHashExists,
  downloadApp,
} from "@/services/community";
import { execPromise } from "@/utils/exec";

function terminate() {
  term.grabInput(false);
  setTimeout(function () {
    process.exit();
  }, 100);
}

term.on("key", function (name: string, _: any, __: any) {
  if (name === "CTRL_C") {
    terminate();
  }
});

const folders = [
  ".community/nginx/conf",
  ".community/nginx_cert/conf",
  ".community/certbot/www",
  ".community/certbot/conf",
  ".community/config",
  ".community/data",
  ".community/uploads",
  ".community/web",
];

// Purpose: Start the application.
async function main() {
  term.clear();

  const logo = readFileSync("./assets/cw.ans", "utf8");

  term(logo);

  term.nextLine(2);

  term.bold("Citizen Wallet - Community Server\n");

  // TODO: when we need more automation, adding these steps would be helpful

  // check if .community folders exist and create them if they don't
  folders.forEach((folder) => {
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
  });

  const systemOS = os.platform();
  let systemArch = os.arch();
  if (systemArch === "x64") {
    systemArch = "amd64";
  }

  if (
    systemOS !== "linux" ||
    !(systemArch === "amd64" || systemArch === "arm64")
  ) {
    term.red(
      `Please use a Linux system with an AMD64 or ARM64 architecture.\n`
    );
    term(
      "Add a GitHub issue or make a pull request if you need support for other systems.\n"
    );
    term.underline("https://github.com/citizenwallet/community");
    process.exit(1);
  }

  // TODO: check if .env files exist
  if (!existsSync(".env")) {
    term("Creating .env file...\n");

    // Read the file
    let env = readFileSync(".env.example", "utf8");

    // replace the placeholders with values
    // os
    env = env.replace("<os>", systemOS);

    // arch
    env = env.replace("<arch>", systemArch);

    // nginx_host
    term("\nEnter the host name for the community server: ");
    const nginxHostInput = ((await term.inputField({}).promise) || "").trim();
    if (!nginxHostInput) {
      term.red("Host name is required.\n");
      process.exit(1);
    }

    env = env.replace("<nginx_host>", nginxHostInput);

    // session_balance_transfer_address
    // term("Enter the session balance transfer address: ");
    // const sessionBalanceTransferAddressInput = (
    //   (await term.inputField({}).promise) || ""
    // ).trim();

    // if (!sessionBalanceTransferAddressInput) {
    //   term.red("Session balance transfer address is required.\n");
    //   process.exit(1);
    // }

    // env = env.replace(
    //   "<session_balance_transfer_address>",
    //   sessionBalanceTransferAddressInput
    // );

    // ipfs_cdn_url
    term("\nEnter the IPFS CDN URL: ");
    const ipfsCdnUrlInput = (
      (await term.inputField({}).promise) || "https://ipfs.io/ipfs/"
    ).trim();
    if (!ipfsCdnUrlInput) {
      term.red("IPFS CDN URL is required.\n");
      process.exit(1);
    }

    env = env.replace("<ipfs_cdn_url>", ipfsCdnUrlInput);

    // pinata_api_key
    term("\nEnter the Pinata API key: ");
    const pinataApiKeyInput = (
      (await term.inputField({}).promise) || ""
    ).trim();
    if (!pinataApiKeyInput) {
      term.red("Pinata API key is required.\n");
      process.exit(1);
    }

    env = env.replace("<pinata_api_key>", pinataApiKeyInput);

    // pinata_api_secret
    term("\nEnter the Pinata API secret: ");
    const pinataApiSecretInput = (
      (await term.inputField({}).promise) || ""
    ).trim();
    if (!pinataApiSecretInput) {
      term.red("Pinata API secret is required.\n");
      process.exit(1);
    }

    env = env.replace("<pinata_api_secret>", pinataApiSecretInput);

    // write .env
    const filePath = ".env";
    term("\nWriting .env file...\n");

    term(`writing ${env} to ${filePath}\n`);

    // write the file
    await execPromise(`echo '${env}' > ${filePath}`);

    term("Created .env file.\n");
  }
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
    cursor = term.saveCursor();
    cursor("Indexer: starting...");
    spinner = await term.spinner("dotSpinner");
    await execPromise("docker compose up indexer --build -d");
    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("Indexer: started ✅\n");

    // app
    config();

    cursor = term.saveCursor();
    cursor("App: compiling...");
    spinner = await term.spinner("dotSpinner");

    await downloadApp();

    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("App: compiled ✅\n");
  }

  // compile community
  cursor = term.saveCursor();
  cursor("Community: compiling...");
  spinner = await term.spinner("dotSpinner");
  await execPromise("npm run build");
  spinner.animate(false);
  cursor.eraseLine();
  cursor.column(1);
  cursor("Community: compiled ✅\n");

  // start community
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

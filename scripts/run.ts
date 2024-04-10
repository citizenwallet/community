import os from "os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { execSync, spawn } from "child_process";
import qrcode from "qrcode-terminal";
import { config } from "dotenv";
import {
  communityFileExists,
  communityHashExists,
  readCommunityFile,
} from "@/services/community";
import { downloadIndexer, startIndexer } from "@/services/indexer";
import { downloadApp } from "@/services/app";
import { execPromise } from "@/utils/exec";
import { generateBase64Key } from "@/utils/random";
import { getSystemInfo } from "@/utils/system";
import { encrypt } from "@/utils/encrypt";
import { ethers } from "ethers";

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
  ".community/indexer",
];

// Purpose: Start the application.
async function main() {
  term.clear();

  const logo = readFileSync("./assets/cw.ans", "utf8");

  term(logo);

  term.nextLine(2);

  term.bold("Citizen Wallet - Community Server\n");

  // check if .community folders exist and create them if they don't
  folders.forEach((folder) => {
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
  });

  execSync("sudo chmod -R u+r ./.community");

  const { systemOS, systemArch } = getSystemInfo();

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

  let pinataApiKeyInput = "";
  let pinataApiSecretInput = "";

  let dbSecret = "";

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
    pinataApiKeyInput = ((await term.inputField({}).promise) || "").trim();
    if (!pinataApiKeyInput) {
      term.red("Pinata API key is required.\n");
      process.exit(1);
    }

    env = env.replace("<pinata_api_key>", pinataApiKeyInput);

    // pinata_api_secret
    term("\nEnter the Pinata API secret: ");
    pinataApiSecretInput = ((await term.inputField({}).promise) || "").trim();
    if (!pinataApiSecretInput) {
      term.red("Pinata API secret is required.\n");
      process.exit(1);
    }

    env = env.replace("<pinata_api_secret>", pinataApiSecretInput);

    // db_secret
    dbSecret = generateBase64Key(32);

    env = env.replace("<db_secret>", dbSecret);

    // write .env
    const filePath = process.cwd() + "/.env";
    term("\nWriting .env file...\n");

    // write the file
    writeFileSync(filePath, env);

    term("Created .env file.\n");
  }

  if (!existsSync(".env.indexer")) {
    // Read the file
    let env = readFileSync(".env.indexer.example", "utf8");
    term("Creating .env.indexer file...\n");

    // pinata_api_key
    if (!pinataApiKeyInput) {
      term("\nEnter the Pinata API key: ");
      pinataApiKeyInput = ((await term.inputField({}).promise) || "").trim();
      if (!pinataApiKeyInput) {
        term.red("Pinata API key is required.\n");
        process.exit(1);
      }
    }

    env = env.replace("<pinata_api_key>", pinataApiKeyInput);

    // pinata_api_secret
    if (!pinataApiSecretInput) {
      term("\nEnter the Pinata API secret: ");
      pinataApiSecretInput = ((await term.inputField({}).promise) || "").trim();
      if (!pinataApiSecretInput) {
        term.red("Pinata API secret is required.\n");
        process.exit(1);
      }
    }

    env = env.replace("<pinata_api_secret>", pinataApiSecretInput);

    // db_secret
    if (!dbSecret) {
      dbSecret = generateBase64Key(32);
    }

    env = env.replace("<db_secret>", dbSecret);

    // write the file
    const filePath = process.cwd() + "/.env.indexer";
    writeFileSync(filePath, env);

    const pk = ethers.Wallet.createRandom().privateKey.replace("0x", "");

    const encryptedKey = encrypt(pk, dbSecret);

    console.log("dbSecret", dbSecret);
    console.log("pk", pk);
    console.log("encryptedKey", encryptedKey);

    writeFileSync(".community/config/pk", encryptedKey);

    term("Created .env.indexer file.\n");
  }

  if (!existsSync(".community/nginx_cert/conf/nginx.conf")) {
    config();

    term("Creating cert nginx.conf file...\n");

    // Read the file
    let nginxConf = readFileSync("./nginx.cert.conf.example", "utf8");

    // replace the placeholders with values
    // host_name
    const nginxHost = process.env.NGINX_HOST;
    if (!nginxHost) {
      term.red("Host name is required.\n");
      process.exit(1);
    }

    nginxConf = nginxConf.replaceAll("<host_name>", nginxHost);

    // write nginx.conf
    const filePath = process.cwd() + "/.community/nginx_cert/conf/nginx.conf";
    term("\nWriting cert nginx.conf file...\n");

    // write the file
    writeFileSync(filePath, nginxConf);

    term("Created cert nginx.conf file.\n");
  }

  if (!existsSync(".community/nginx/conf/nginx.conf")) {
    config();

    term("Creating nginx.conf file...\n");

    // Read the file
    let nginxConf = readFileSync("./nginx.conf.example", "utf8");

    // replace the placeholders with values
    // host_name
    const nginxHost = process.env.NGINX_HOST;
    if (!nginxHost) {
      term.red("Host name is required.\n");
      process.exit(1);
    }

    nginxConf = nginxConf.replaceAll("<host_name>", nginxHost);

    // docker_host_ip
    const dockerHostIp = execSync(
      "ip -4 addr show docker0 | grep -Po 'inet \\K[\\d.]+'"
    )
      .toString()
      .trim();
    if (!dockerHostIp) {
      term.red("Docker host IP is required.\n");
      process.exit(1);
    }

    nginxConf = nginxConf.replaceAll("<docker_host_ip>", dockerHostIp);

    // write nginx.conf
    const filePath = process.cwd() + "/.community/nginx/conf/nginx.conf";
    term("\nWriting nginx.conf file...\n");

    // write the file
    writeFileSync(filePath, nginxConf);

    term("Created nginx.conf file.\n");
  }

  if (!existsSync(".community/certbot/conf/live")) {
    config();

    const nginxHost = process.env.NGINX_HOST;
    if (!nginxHost) {
      term.red("Host name is required.\n");
      process.exit(1);
    }

    term(`Generating an SSL certificate for ${nginxHost}...\n`);

    // user needs to add a DNS entry
    const publicIp = await import("public-ip");
    const ip = await publicIp.publicIpv4();

    term("Please add the following DNS entry to your domain:\n");

    term.bold(`\n\nA ${ip} ${process.env.NGINX_HOST}\n\n`);

    term("\nIs your DNS configured (y/n): \n");
    await term.yesOrNo({ yes: ["yes", "y"], no: ["no", "n"] }).promise;

    // pinata_api_key
    term("\nWhat email would you like to associate with your domain: \n");
    const emailInput = ((await term.inputField({}).promise) || "").trim();
    if (!emailInput) {
      term.red("An email is required.\n");
      process.exit(1);
    }

    term.nextLine(2);
    const cursor = term.saveCursor();
    cursor("Certificate Generation: starting...");
    let spinner = await term.spinner("dotSpinner");
    // generate SSL certs
    execSync(
      `docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d ${nginxHost} --agree-tos --no-eff-email --email ${emailInput}
    `,
      { stdio: "ignore" }
    );
    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("Certificate Generation: success ✅\n");

    if (!existsSync(".community/certbot/conf/live")) {
      term.red("There was an error generating a certificate.\n");

      term.red(
        "Make sure that your DNS is correct (it can sometimes take time for the settings to propogate).\n"
      );
      process.exit(1);
    }
  }

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
    config();

    // start indexer
    cursor = term.saveCursor();
    cursor("Indexer: starting...");
    spinner = await term.spinner("dotSpinner");
    const community = readCommunityFile();
    if (!community) {
      term.red("Community not configured.\n");
      process.exit(1);
    }
    downloadIndexer();
    startIndexer(community.node.chain_id);
    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("Indexer: started ✅\n");

    // app
    cursor = term.saveCursor();
    cursor("App: compiling...");
    spinner = await term.spinner("dotSpinner");

    downloadApp();

    spinner.animate(false);
    cursor.eraseLine();
    cursor.column(1);
    cursor("App: compiled ✅\n");
  } else {
    // first time start
  }

  // start community
  cursor = term.saveCursor();
  cursor("Community: starting...");
  spinner = await term.spinner("dotSpinner");

  try {
    const command = "sudo lsof -i :3000 -t";
    const pid = execSync(command).toString().trim();
    if (pid) {
      execSync(`kill ${pid}`);
    }
  } catch (_) {}

  spawn("node server.js", {
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

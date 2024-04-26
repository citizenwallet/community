import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { execSync, spawn } from "child_process";
import { generateBase64Key } from "@/utils/random";
import { getSystemInfo } from "@/utils/system";
import { resolve } from "path";

function terminate() {
  term.grabInput(false);
  killDevServer();
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

  execSync("chmod -R u+r ./.community");

  const { systemOS, systemArch } = getSystemInfo();

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

  term.nextLine(2);

  killDevServer();

  term("Community: started ✅\n");

  return new Promise<void>((resolve) => {
    const child = spawn("npm", ["run", "dev"], {
      shell: true,
    });

    child.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`${data}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function killDevServer() {
  try {
    const command = "lsof -i :3000 -t";
    const pid = execSync(command).toString().trim();
    if (pid) {
      execSync(`kill ${pid}`);
    }
  } catch (_) {}
}

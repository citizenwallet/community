import { readFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { spawn } from "child_process";
import qrcode from "qrcode-terminal";
import { config } from "dotenv";

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

// Purpose: Start the application.
async function main() {
  const logo = readFileSync("./assets/cw.ans", "utf8");

  term(logo);

  term.nextLine(2);

  term("Welcome to Citizen Wallet\n");
  // TODO: check if .env files exist
  // TODO: if !exists >> prep .env files for nginx and community
  // TODO: check if certs exist
  // TODO: if !exists >> ask for host name
  // TODO: if !exists >> generate SSL certs
  // TODO: if !exists >> stop containers

  // start nginx
  term.nextLine(2);
  term("Server: starting...");
  let spinner = await term.spinner("dotSpinner");
  await execPromise("docker compose up server -d");
  spinner.animate(false);
  term.previousLine(1);
  term("Server: started ✅\n");

  // compile community
  term.nextLine(2);
  term("Community: compiling...");
  spinner = await term.spinner("dotSpinner");
  await execPromise("npm run build");
  spinner.animate(false);
  term.previousLine(1);
  term("Community: compiled ✅\n");

  // start community
  term.nextLine(1);
  term("Community: starting...");
  spinner = await term.spinner("dotSpinner");
  spawn("npx next start -H 0.0.0.0");
  spinner.animate(false);
  term.previousLine(1);
  term("Community: started ✅\n");

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

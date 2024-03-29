import { readFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { exec, spawn } from "child_process";
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

    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });

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
  term("Server: starting...\n");
  let spinner = await term.spinner("dotSpinner");
  await execPromise("docker compose up server -d");
  spinner.animate(false);
  term("Server: started ✅\n");

  // compile community
  term.nextLine(2);
  term("Community: compiling...\n");
  spinner = await term.spinner("dotSpinner");
  await execPromise("npm run build");
  spinner.animate(false);
  term("Community: compiled ✅\n");

  // start community
  term.nextLine(2);
  term("Community: starting...\n");
  spinner = await term.spinner("dotSpinner");
  spawn("npx next start -H 0.0.0.0");
  spinner.animate(false);
  term("Community: started ✅\n");

  // parse .env
  config();

  // display url
  term.nextLine(2);
  term("Community: URL\n");
  term.underline(`https://${process.env.NGINX_HOST}`);
  term.nextLine(2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

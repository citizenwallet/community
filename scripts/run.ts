import { readFileSync } from "fs";
import { terminal as term } from "terminal-kit";
import { execSync } from "child_process";

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
  term("Starting nginx\n");
  execSync("docker compose up server");

  // compile community
  term.nextLine(2);
  term("Compiling community\n");
  execSync("npm run build");

  // start community
  term.nextLine(2);
  term("Starting community\n");
  execSync("npx next start -H 0.0.0.0");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

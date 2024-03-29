const { readFileSync } = require("fs");
const { terminal: term } = require("terminal-kit");

// Purpose: Start the application.
async function main() {
  const logo = readFileSync("./assets/citizenwallet.ans", "utf8");

  term(logo);

  term.nextLine(2);

  term("Welcome to Citizen Wallet\n");
  // TODO: check if .env files exist
  // TODO: if !exists >> prep .env files for nginx and community
  // TODO: check if certs exist
  // TODO: if !exists >> ask for host name
  // TODO: if !exists >> generate SSL certs
  // TODO: if !exists >> stop containers
  // TODO: start nginx
  // TODO: compile community
  // TODO: start community
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

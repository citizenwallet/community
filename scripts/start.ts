// Purpose: Start the application.
async function main() {
  console.log("Starting application");
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

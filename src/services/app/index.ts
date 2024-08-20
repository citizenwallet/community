import { execSync, spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const downloadApp = () => {
  // clean up the web folder
  execSync(`rm -rf ${process.cwd()}/.community/web/*`);

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  execSync(
    `curl -H 'Cache-Control: no-cache' -o ${process.cwd()}/.community/${buildVersionFileName}-webapp -L ${buildOutputUrl}/webapp/${buildVersionFileName}?cache_buster=$(date +%s) > /dev/null 2>&1`
  );

  const buildVersion = readFileSync(
    `${process.cwd()}/.community/${buildVersionFileName}-webapp`,
    "utf8"
  ).replace(/\r?\n|\r/g, "");

  // download the app
  execSync(
    `curl -o ${process.cwd()}/.community/webapp.tar.gz -L ${buildOutputUrl}/webapp/webapp_${buildVersion}.tar.gz > /dev/null 2>&1`
  );

  // extract the app
  execSync(
    `tar -xvf ${process.cwd()}/.community/webapp.tar.gz -C .community/web > /dev/null 2>&1`
  );

  // remove the tar
  execSync(`rm -rf ${process.cwd()}/.community/webapp.tar.gz > /dev/null 2>&1`);
};

export const appProcessId = (): string | undefined => {
  try {
    // for some reason, lsof -i :3002 doesn't return the node process
    // we could use `fuser 3002/tcp` but it's not available on all systems
    // the following command works on linux and mac
    const command =
      "ps -eo pid,args | grep 3002 | head -n 1 | awk '{print $1}'";
    const pid = execSync(command).toString().trim();

    return pid;
  } catch (error) {
    return undefined;
  }
};

export const stopApp = () => {
  const pid = appProcessId();
  if (!pid) {
    return;
  }

  execSync(`kill ${pid}`);
};

export const startApp = () => {
  stopApp();

  spawn("PORT=3002 node .community/web/server.js", {
    detached: true,
    shell: true,
    stdio: "ignore",
  });
};

export const isAppCompiled = async () => {
  const filePath = path.join(process.cwd(), ".community/web/server.js");
  return existsSync(filePath);
};

export const isAppRunning = () => {
  const pid = appProcessId();

  return !!pid;
};

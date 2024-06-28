import { execSync, spawn } from "child_process";
import { readFileSync } from "fs";
import os from "os";

export const downloadDashboard = async () => {
  // Get the home directory
  const homeDirectory = os.homedir();

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  execSync(
    `curl -H 'Cache-Control: no-cache' -o ${homeDirectory}/community_${buildVersionFileName} -L ${buildOutputUrl}/community/${buildVersionFileName}?cache_buster=$(date +%s) > /dev/null 2>&1`
  );

  const buildVersion = readFileSync(
    `${homeDirectory}/community_${buildVersionFileName}`,
    "utf8"
  ).replace(/\r?\n|\r/g, "");

  // download the app
  execSync(
    `curl -o ${homeDirectory}/community.tar.gz -L ${buildOutputUrl}/community/dashboard_${buildVersion}.tar.gz > /dev/null 2>&1`
  );

  // extract the app
  execSync(
    `tar -xvf ${homeDirectory}/community.tar.gz -C ${homeDirectory}/community > /dev/null 2>&1`
  );

  // remove the tar
  execSync(`rm -rf ${homeDirectory}/community.tar.gz > /dev/null 2>&1`);
};

export const dashboardProcessId = (): string | undefined => {
  try {
    const command = "lsof -i :3000 -t";
    const pid = execSync(command).toString().trim();

    return pid;
  } catch (error) {
    return undefined;
  }
};

export const stopDashboard = () => {
  const pid = dashboardProcessId();
  if (!pid) {
    return;
  }

  execSync(`kill ${pid}`);
};

export const startDashboard = () => {
  stopDashboard();

  spawn("PORT=3000 node server.js", {
    detached: true,
    shell: true,
    stdio: "ignore",
  });
};

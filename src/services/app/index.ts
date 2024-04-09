import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const downloadApp = () => {
  // clean up the web folder
  execSync(`rm -rf ${process.cwd()}/.community/web/*`);

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  execSync(
    `curl -H 'Cache-Control: no-cache' -o ${process.cwd()}/.community/${buildVersionFileName}-web -L ${buildOutputUrl}/web/${buildVersionFileName}?cache_buster=$(date +%s) > /dev/null 2>&1`
  );

  const buildVersion = readFileSync(
    `${process.cwd()}/.community/${buildVersionFileName}-web`,
    "utf8"
  ).replace(/\r?\n|\r/g, "");

  // download the app
  execSync(
    `curl -o ${process.cwd()}/.community/app.tar.gz -L ${buildOutputUrl}/web/cw_web_${buildVersion}.tar.gz > /dev/null 2>&1`
  );

  // extract the app
  execSync(
    `tar -xvf ${process.cwd()}/.community/app.tar.gz -C .community/web > /dev/null 2>&1`
  );

  // remove the tar
  execSync(`rm -rf ${process.cwd()}/.community/app.tar.gz > /dev/null 2>&1`);
};

export const isAppCompiled = async () => {
  const filePath = path.join(process.cwd(), ".community/web/index.html");
  return existsSync(filePath);
};

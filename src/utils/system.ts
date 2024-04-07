import os from "os";

export const getSystemInfo = () => {
  const systemOS = os.platform();
  let systemArch = os.arch();
  if (systemArch === "x64") {
    systemArch = "amd64";
  }

  return {
    systemOS,
    systemArch,
  };
};

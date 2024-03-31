import { spawn } from "child_process";

export function execPromise(command: string, verbose = false) {
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

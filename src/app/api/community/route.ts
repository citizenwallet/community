import fs from "fs";
import path from "path";
import { Config } from "@citizenwallet/sdk";

export async function GET(req: Request) {
  try {
    const filePath = path.join(
      process.cwd(),
      `.community/config/community.json`
    );

    const exists = fs.existsSync(filePath);
    if (!exists) {
      throw new Error("File does not exist");
    }

    const configFile = fs.readFileSync(filePath, "utf8");

    const config = JSON.parse(configFile) as Config;

    return Response.json(config, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}

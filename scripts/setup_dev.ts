import { ethers } from "ethers";
import { encrypt } from "@/utils/encrypt";
import { generateBase64Key } from "@/utils/random";
import { terminal as term } from "terminal-kit";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

function terminate() {
  term.grabInput(false);
  setTimeout(function () {
    process.exit();
  }, 100);
}

term.on("key", function (name: string, _: any, __: any) {
  if (name === "CTRL_C") {
    terminate();
  }
});

async function main() {
  console.log("Hello");
  term.clear();

  term.nextLine(2);
  term("⏳ Creating .env file...\n");

  // Read the file
  let env = readFileSync(".env.example", "utf8");

  const dbSecret = generateBase64Key(32);
  env = env.replace("<db_secret>", dbSecret);

  // write .env
  const filePath = process.cwd() + "/.env.local";
  term("\nWriting .env file...\n");

  // write the file
  writeFileSync(filePath, env);

  term(`✅ Created .env file on ${filePath}.\n`);

  const pk = ethers.Wallet.createRandom().privateKey.replace("0x", "");

  const b64PK = btoa(pk);

  const encryptedKey = encrypt(b64PK, dbSecret);

  writeFileSync(".community/config/pk", encryptedKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

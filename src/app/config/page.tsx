import Config from "@/containers/Config";
import { readFileSync } from "fs";
import ErrorPage from "@/templates/ErrorPage";
import { decrypt } from "@/utils/encrypt";
import { ethers } from "ethers";

export const dynamic = "force-dynamic";

export default async function Page() {
  let pk;
  try {
    pk = readFileSync(process.cwd() + "/.community/config/pk", "utf8").trim();
  } catch (e) {
    console.error(e);
  }
  if (!pk) {
    return <ErrorPage title="Missing configuration file" />;
  }

  const dbSecret = process.env.DB_SECRET;
  if (!dbSecret) {
    return <ErrorPage title="Missing configuration file" />;
  }

  const decryptedPk = decrypt(pk, dbSecret);

  const parsedPk = atob(decryptedPk);

  const ethPk = new ethers.Wallet(parsedPk);

  return <Config sponsor={ethPk.address} />;
}

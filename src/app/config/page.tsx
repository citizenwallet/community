import Config from "@/containers/Config";
import { readFileSync } from "fs";
import InfoPageTemplate from "@/templates/InfoPage";
import { decrypt } from "@/utils/encrypt";
import { ethers } from "ethers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pk = readFileSync(process.cwd() + "/.community/config/pk", "utf8");
  if (!pk) {
    return <InfoPageTemplate description="Missing configuration file" />;
  }

  const dbSecret = process.env.DB_SECRET;
  if (!dbSecret) {
    return <InfoPageTemplate description="Missing configuration file" />;
  }

  const decryptedPk = decrypt(pk, dbSecret);

  const ethPk = new ethers.Wallet(decryptedPk);

  return <Config sponsor={ethPk.address} />;
}

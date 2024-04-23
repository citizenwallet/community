// FILEPATH: /Users/kevin/projects/techi/cw/community/tests/utils/encrypt.test.ts
import { expect } from "@jest/globals";
import { decrypt, encrypt } from "../src/utils/encrypt";
import { generateBase64Key } from "../src/utils/random";
import { ethers } from "ethers";

describe("decrypt", () => {
  it("should decrypt a value correctly", () => {
    const key = generateBase64Key(32);

    const pk = ethers.Wallet.createRandom().privateKey.replace("0x", "");

    const b64PK = btoa(pk);

    const encryptedValue = encrypt(b64PK, key);

    const decryptedValue = decrypt(encryptedValue, key);

    expect(decryptedValue).toBe(b64PK);
  });

  it("should throw an error if the key is incorrect", () => {
    const key = generateBase64Key(32);
    const wrongKey = generateBase64Key(32);
    const pk = ethers.Wallet.createRandom().privateKey.replace("0x", "");

    const b64PK = btoa(pk);

    const encryptedValue = encrypt(b64PK, key);

    const wrongValue = decrypt(encryptedValue, wrongKey);

    expect(wrongValue).not.toBe(b64PK);
  });
});

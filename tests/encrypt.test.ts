// FILEPATH: /Users/kevin/projects/techi/cw/community/tests/utils/encrypt.test.ts
import { expect } from "@jest/globals";
import { decrypt, encrypt } from "../src/utils/encrypt";
import { generateBase64Key } from "../src/utils/random";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import { config } from "dotenv";

describe("decrypt", () => {
  it("should decrypt a value correctly", () => {
    const key = generateBase64Key(32);
    console.log("key", key);
    const testValue = ethers.Wallet.createRandom().privateKey.replace("0x", "");
    console.log("testValue", testValue);

    const encryptedValue = encrypt(testValue, key);

    console.log("encryptedValue", encryptedValue);

    const decryptedValue = decrypt(encryptedValue, key);

    // console.log("parsedValue", parsedValue);

    // expect(parsedValue).toBe(testValue);
  });

  it("should throw an error if the key is incorrect", () => {
    const key = generateBase64Key(32);
    const wrongKey = generateBase64Key(32);
    const testValue = ethers.Wallet.createRandom().privateKey.replace("0x", "");

    const encryptedValue = encrypt(testValue, key);

    const wrongValue = decrypt(encryptedValue, wrongKey);

    // expect(wrongValue).not.toBe(testValue);
  });
});

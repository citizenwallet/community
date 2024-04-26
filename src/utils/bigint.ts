import crypto from "crypto";

export function randomUint256() {
  const randomBytes = crypto.randomBytes(32); // Generate 32 random bytes
  let hex = randomBytes.toString("hex"); // Convert bytes to hexadecimal
  return BigInt("0x" + hex); // Convert hexadecimal to BigInt
}

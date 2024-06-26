import crypto from "crypto";

export const encrypt = (secretValue: string, key: string): string => {
  const keyBuffer = Buffer.from(key, "base64");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cfb", keyBuffer, iv);
  const plaintext = Buffer.from(secretValue, "base64");
  let ciphertext = cipher.update(plaintext);
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  const ciphertextWithIv = Buffer.concat([iv, ciphertext]);

  let result = ciphertextWithIv.toString("base64url");
  if (result.length !== 108) {
    result += "=".repeat(108 - result.length);
  }
  return result;
};

export const decrypt = (encryptedValue: string, key: string): string => {
  const keyBuffer = Buffer.from(key, "base64");
  const encryptedBuffer = Buffer.from(encryptedValue, "base64url");
  const iv = encryptedBuffer.subarray(0, 16);
  const encryptedText = encryptedBuffer.subarray(16);
  const decipher = crypto.createDecipheriv("aes-256-cfb", keyBuffer, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("base64");
};

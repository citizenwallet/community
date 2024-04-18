import crypto from "crypto";

export const generateKey = (size = 16) =>
  crypto.randomBytes(size).toString("hex");

export const generateBase64Key = (size = 16, format = "base64") =>
  crypto.randomBytes(size).toString(format as BufferEncoding);

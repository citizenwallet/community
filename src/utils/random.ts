import crypto from "crypto";

export const generateKey = (size = 16) =>
  crypto.randomBytes(size).toString("hex");

export const generateBase64Key = (size = 16) =>
  crypto.randomBytes(size).toString("base64");

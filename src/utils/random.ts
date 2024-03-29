import crypto from "crypto";

export const generateKey = (size = 16) =>
  crypto.randomBytes(size).toString("hex");

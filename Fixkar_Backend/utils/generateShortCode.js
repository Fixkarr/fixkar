import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    8
);

export function generateShortCode() {
  return nanoid();
}


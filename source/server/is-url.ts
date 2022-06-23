/// <reference types="node" />
import { URL } from "url";

export const isUrl = (input: string) => {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
};

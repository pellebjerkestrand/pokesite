/// <reference types="node" />
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

fs.readdirSync(path.resolve(__dirname, "../../../dist/static-files/public"))
  .map((filename) => `/static-files/${filename}`)
  .forEach((url) =>
    test(url, async ({ request }) => {
      const response = await request.get(url);
      await expect(response).toBeOK();
    })
  );

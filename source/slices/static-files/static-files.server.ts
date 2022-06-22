/// <reference types="node" />
import { promises as fsp } from "fs";
import path from "path";
import { URL } from "url";

import type { FileFunction } from "../../server/file-function.types";

// NOTE: Since there's no static file trigger,
// which there absolutely should be, we have to make our own.
// It's small, but works really well.
// The files we look for are created by the client build.

const fileContentTypes: Record<string, string> = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "application/octet-stream",
  ".woff2": "application/octet-stream",
  ".xml": "application/xml",
};

const toFile = (
  data: Buffer,
  size: number,
  extension: string
): [Buffer, number, string] => [
  data,
  size,
  fileContentTypes[extension] ?? "text/plain",
];

const getFile = async (url: string): Promise<[Buffer, number, string]> => {
  const filename = path.basename(new URL(url).pathname);
  const filepath = path.join(process.cwd(), "static-files", "public", filename);

  return Promise.all([fsp.readFile(filepath), fsp.stat(filepath)])
    .then(([data, { size }]) => toFile(data, size, path.parse(filepath).ext))
    .catch((error) => {
      if (error.code === "ENOENT") {
        return [Buffer.from(""), 0, "text/plain"];
      }
      throw error;
    });
};

const toEmptyResponse = (status: number) => ({
  body: Buffer.from(""),
  headers: {
    "content-length": 0,
    "content-type": "text/plain",
  },
  status,
});

export const run: FileFunction = async (_, request) => {
  try {
    const [data, size, type] = await getFile(request.url);

    if (size) {
      return {
        body: data,
        headers: {
          "content-length": size,
          "content-type": type,
        },
      };
    }
  } catch {
    return toEmptyResponse(500);
  }

  return toEmptyResponse(404);
};

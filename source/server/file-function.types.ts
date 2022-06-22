/// <reference types="node" />
import type { HttpRequest } from "@azure/functions";

import type { HttpResponseBase, HttpContext } from "./http-trigger.types";

type FileResponse = HttpResponseBase & {
  body: Buffer;
  headers: {
    "content-length": number;
    "content-type": string;
  };
};

export type FileFunction = (
  context: HttpContext,
  request: HttpRequest
) => Promise<FileResponse>;

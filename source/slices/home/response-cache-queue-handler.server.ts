import fetch from "node-fetch";

import { read, ReadOutcome, write, WriteOutcome } from "../../server/cache";
import { isUrl } from "../../server/is-url";
import type { QueueHandlerFunction } from "../../server/queue-function.types";
import { resourceListDecoder } from "./resource-list";

export const run: QueueHandlerFunction = async (_, message) => {
  if (typeof message !== "string") {
    throw new Error(`Message is not a string. ${message}`);
  }

  if (!isUrl(message)) {
    throw new Error(`Message is not an URL. ${message}`);
  }

  const cacheResponse = await read(message, resourceListDecoder);
  if (cacheResponse.outcome === ReadOutcome.success) {
    return;
  }

  const response = await fetch(message);
  if (!response.ok) {
    throw new Error(
      `Response is not OK. ${response.status} ${response.statusText} ${message}`
    );
  }

  const setOutcome = await write(message, await response.text());
  if (setOutcome === WriteOutcome.failure) {
    throw new Error(`Could not set. ${message}`);
  }
};

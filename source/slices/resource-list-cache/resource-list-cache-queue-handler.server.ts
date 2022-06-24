import fetch from "node-fetch";

import {
  Namespace,
  read,
  ReadOutcome,
  write,
  WriteOutcome,
} from "../../server/cache";
import { isUrl } from "../../server/is-url";
import { resourceListDecoder } from "../../server/resource-list";
import type { QueueHandlerFunction } from "../../azure-functions/queue-function.types";

export const run: QueueHandlerFunction = async (_, message) => {
  if (typeof message !== "string") {
    throw new Error(`Message is not a string. ${message}`);
  }

  if (!isUrl(message)) {
    throw new Error(`Message is not an URL. ${message}`);
  }

  const cacheResponse = await read(
    Namespace.resourceList,
    message,
    resourceListDecoder
  );
  if (cacheResponse.outcome === ReadOutcome.success) {
    return;
  }

  const response = await fetch(message);
  if (!response.ok) {
    throw new Error(
      `Response is not OK. ${response.status} ${response.statusText} ${message}`
    );
  }

  const decodedBody = resourceListDecoder.decode(await response.json());
  if (!decodedBody.isOk()) {
    throw new Error(`Response body is not OK. ${decodedBody.error}`);
  }

  const setOutcome = await write(
    Namespace.resourceList,
    message,
    decodedBody.value
  );
  if (setOutcome === WriteOutcome.failure) {
    throw new Error(`Could not set. ${message}`);
  }
};

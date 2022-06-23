import fetch from "node-fetch";
import { type FromDecoder, JsonDecoder } from "ts.data.json";

import { Namespace, read, ReadOutcome } from "./cache";
import { isUrl } from "./is-url";

const { array, number, object, optional, string } = JsonDecoder;

// NOTE: See https://pokeapi.co/docs/v2#resource-listspagination-section

const resourceDecoder = object(
  {
    name: string,
    url: string,
  },
  "Resource"
);

const resourcesDecoder = array(resourceDecoder, "Resources");

export const resourceListDecoder = object(
  {
    count: number,
    next: optional(string),
    previous: optional(string),
    results: resourcesDecoder,
  },
  "ResourceList"
);

export enum GetOutcome {
  failure = "failure",
  invalidKey = "invalidKey",
  success = "success",
}

export const get = async (
  url: string
): Promise<
  | {
      outcome: GetOutcome.success;
      value: FromDecoder<typeof resourceListDecoder>;
    }
  | {
      outcome: Exclude<GetOutcome, GetOutcome.success>;
    }
> => {
  if (!isUrl(url)) {
    return {
      outcome: GetOutcome.invalidKey,
    };
  }

  const cacheResult = await read(
    Namespace.resourceList,
    url,
    resourceListDecoder
  );
  if (cacheResult.outcome === ReadOutcome.success) {
    return {
      outcome: GetOutcome.success,
      value: cacheResult.value,
    };
  }

  const response = await fetch(url);
  if (!response.ok) {
    return {
      outcome: GetOutcome.failure,
    };
  }

  const decodedResponse = resourceListDecoder.decode(await response.json());
  if (decodedResponse.isOk()) {
    return {
      outcome: GetOutcome.success,
      value: decodedResponse.value,
    };
  }

  return {
    outcome: GetOutcome.failure,
  };
};

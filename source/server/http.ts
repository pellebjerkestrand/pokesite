import fetch from "node-fetch";
import type { FromDecoder, JsonDecoder } from "ts.data.json";

import { read, ReadOutcome } from "./cache";
import { isUrl } from "./is-url";

export enum GetOutcome {
  failure = "failure",
  invalidKey = "invalidKey",
  success = "success",
}

export const get = async <T>(
  url: string,
  decoder: JsonDecoder.Decoder<T>
): Promise<
  | {
      outcome: GetOutcome.success;
      value: FromDecoder<typeof decoder>;
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

  const cacheResult = await read(url, decoder);
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

  const decodedResponse = decoder.decode(await response.json());
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

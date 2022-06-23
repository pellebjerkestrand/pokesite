import fetch from "node-fetch";
import { createClient } from "@redis/client";
import type { FromDecoder, JsonDecoder } from "ts.data.json";
import type { JsonValue } from "type-fest";

import { isUrl } from "./is-url";

const redis = {
  _client: undefined,
  get client(): ReturnType<typeof createClient> {
    if (!this._client) {
      this._client = createClient(
        process.env.REDIS ? { url: process.env.REDIS } : undefined
      );

      this._client.on("error", (error) => {
        console.error(error);
      });
    }

    if (!this._client.isOpen) {
      this._client.connect();
    }

    return this._client;
  },
};

const tryParse = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return;
  }
};

export enum GetOutcome {
  failure = "failure",
  invalidKey = "invalidKey",
  success = "success",
}

export const getFromCache = async <T>(
  key: string,
  decoder: JsonDecoder.Decoder<T>
): Promise<
  | {
      outcome: GetOutcome.success;
      key: string;
      value: FromDecoder<typeof decoder>;
    }
  | {
      outcome: Exclude<GetOutcome, GetOutcome.success>;
    }
> => {
  if (!isUrl) {
    return {
      outcome: GetOutcome.invalidKey,
    };
  }

  const rawData = await redis.client.get(key);
  if (rawData) {
    const decodedData = decoder.decode(tryParse(rawData));
    if (decodedData.isOk()) {
      return {
        outcome: GetOutcome.success,
        key,
        value: decodedData.value,
      };
    }
  }

  return {
    outcome: GetOutcome.failure,
  };
};

export const get = async <T>(
  key: string,
  decoder: JsonDecoder.Decoder<T>
): Promise<
  | {
      outcome: GetOutcome.success;
      key: string;
      value: FromDecoder<typeof decoder>;
    }
  | {
      outcome: Exclude<GetOutcome, GetOutcome.success>;
    }
> => {
  const cacheResult = await getFromCache(key, decoder);
  if (cacheResult.outcome === GetOutcome.success) {
    return cacheResult;
  }

  const response = await fetch(key);
  if (!response.ok) {
    return {
      outcome: GetOutcome.failure,
    };
  }

  const decodedResponse = decoder.decode(await response.json());
  if (decodedResponse.isOk()) {
    return {
      outcome: GetOutcome.success,
      key,
      value: decodedResponse.value,
    };
  }

  return {
    outcome: GetOutcome.failure,
  };
};

export enum SetOutcome {
  failure = "failure",
  success = "success",
}

export const set = async (key: string, value: JsonValue) => {
  const data = typeof value === "string" ? value : JSON.stringify(value);
  const result = await redis.client.set(key, data);
  return result ? SetOutcome.success : SetOutcome.failure;
};

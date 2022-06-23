import fetch from "node-fetch";
import { createClient } from "@redis/client";
import type { FromDecoder, JsonDecoder } from "ts.data.json";
import type { JsonValue } from "type-fest";
import { URL } from "url";

const redis = {
  _client: undefined,
  get client(): ReturnType<typeof createClient> {
    if (!this._client) {
      this._client = createClient(
        process.env.REDIS ? { url: process.env.Redis } : undefined
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

const isUrl = (input: string) => {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
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
  console.debug("[GET]", key);
  if (!isUrl) {
    return {
      outcome: GetOutcome.invalidKey,
    };
  }

  const rawData = await redis.client.get(key);
  console.debug("[RAW DATA]", rawData);
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

  const response = await fetch(key);
  if (!response.ok) {
    return {
      outcome: GetOutcome.failure,
    };
  }

  console.debug("[FETCH OK]", key);

  const decodedResponse = decoder.decode(await response.json());
  if (decodedResponse.isOk()) {
    // TODO: Message to set
    return {
      outcome: GetOutcome.success,
      key,
      value: decodedResponse.value,
    };
  }

  console.debug("[DECODER ERRORS]", decodedResponse.error);

  return {
    outcome: GetOutcome.failure,
  };
};

export enum SetOutcome {
  failure = "failure",
  success = "success",
}

export const set = async (key: string, value: JsonValue) => {
  const result = await redis.client.set(key, JSON.stringify(value));
  return result ? SetOutcome.success : SetOutcome.failure;
};

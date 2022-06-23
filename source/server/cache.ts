import { createClient } from "@redis/client";
import type { FromDecoder, JsonDecoder } from "ts.data.json";
import type { JsonValue } from "type-fest";

const redis: {
  _client: ReturnType<typeof createClient> | undefined;
  client: ReturnType<typeof createClient>;
} = {
  _client: undefined,
  get client() {
    if (!this._client) {
      this._client = createClient(
        process.env.REDIS ? { url: process.env.REDIS } : undefined
      );

      this._client.on("error", (error: unknown) => {
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

export enum ReadOutcome {
  failure = "failure",
  success = "success",
}

export const read = async <T>(
  key: string,
  decoder: JsonDecoder.Decoder<T>
): Promise<
  | {
      outcome: ReadOutcome.success;
      key: string;
      value: FromDecoder<typeof decoder>;
    }
  | {
      outcome: Exclude<ReadOutcome, ReadOutcome.success>;
    }
> => {
  const rawData = await redis.client.get(key);
  if (rawData) {
    const decodedData = decoder.decode(tryParse(rawData));
    if (decodedData.isOk()) {
      return {
        outcome: ReadOutcome.success,
        key,
        value: decodedData.value,
      };
    }
  }

  return {
    outcome: ReadOutcome.failure,
  };
};

export enum WriteOutcome {
  failure = "failure",
  success = "success",
}

export const write = async (key: string, value: JsonValue) => {
  const data = typeof value === "string" ? value : JSON.stringify(value);
  const result = await redis.client.set(key, data);
  return result ? WriteOutcome.success : WriteOutcome.failure;
};

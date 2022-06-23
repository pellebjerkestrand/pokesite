import { createClient } from "@redis/client";
import type { FromDecoder, JsonDecoder } from "ts.data.json";
import type { JsonValue } from "type-fest";

import { tryParse } from "./try-parse";

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

export enum ReadOutcome {
  failure = "failure",
  success = "success",
}

export enum Namespace {
  pageProps = "page-props",
  resourceList = "resource-list",
}

const compoundKey = (namespace: Namespace, key: string) =>
  `${namespace}:${key}`;

export const read = async <T>(
  namespace: Namespace,
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
  const rawData = await redis.client.get(compoundKey(namespace, key));
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

export const write = async <T extends JsonValue>(
  namespace: Namespace,
  key: string,
  value: T
) => {
  const result = await redis.client.set(
    compoundKey(namespace, key),
    JSON.stringify(value)
  );
  return result ? WriteOutcome.success : WriteOutcome.failure;
};

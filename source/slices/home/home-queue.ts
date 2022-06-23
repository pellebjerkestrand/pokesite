import { type FromDecoder, JsonDecoder } from "ts.data.json";
import type { JsonValue } from "type-fest";

import { tryParse } from "../../server/try-parse";
import { type HomeProps, homePropsDecoder } from "./home-props";

const messageDecoder = JsonDecoder.object(
  {
    id: JsonDecoder.string,
    home: homePropsDecoder,
  },
  "Message"
);

export enum FromMessageOutcome {
  failure = "failure",
  success = "success",
}

export const fromMessage = (
  message: JsonValue
):
  | {
      outcome: FromMessageOutcome.success;
      value: FromDecoder<typeof messageDecoder>;
    }
  | {
      outcome: FromMessageOutcome.failure;
      value: string;
    } => {
  const decodedMessage = messageDecoder.decode(
    typeof message === "string" ? tryParse(message) : message
  );

  if (decodedMessage.isOk()) {
    return {
      outcome: FromMessageOutcome.success,
      value: decodedMessage.value,
    };
  }

  return {
    outcome: FromMessageOutcome.failure,
    value: decodedMessage.error,
  };
};

export const toMessage = (id: string, props: HomeProps) =>
  JSON.stringify({ id, props });

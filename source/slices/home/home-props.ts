import { type FromDecoder, JsonDecoder } from "ts.data.json";

const { array, object, string } = JsonDecoder;

export const homePropsDecoder = object(
  {
    list: array(string, "List"),
    title: string,
  },
  "HomeProps"
);

export type HomeProps = FromDecoder<typeof homePropsDecoder>;

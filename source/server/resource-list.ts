import { JsonDecoder } from "ts.data.json";

const { array, number, object, optional, string } = JsonDecoder;

// NOTE: See https://pokeapi.co/docs/v2#resource-listspagination-section

const resultDecoder = object(
  {
    name: string,
    url: string,
  },
  "Result"
);

export const resultsDecoder = array(resultDecoder, "Results");

export const resourceListDecoder = object(
  {
    count: number,
    next: optional(string),
    previous: optional(string),
    results: resultsDecoder,
  },
  "ResourceList"
);

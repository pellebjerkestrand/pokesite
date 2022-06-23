import { camelCase } from "camel-case";
import { JsonDecoder } from "ts.data.json";

const { array, number, object, optional, string } = JsonDecoder;

export const queueName = camelCase("resourceList");

// NOTE: See https://pokeapi.co/docs/v2#resource-listspagination-section

const resourceDecoder = object(
  {
    name: string,
    url: string,
  },
  "Resource"
);

export const resourcesDecoder = array(resourceDecoder, "Resources");

export const resourceListDecoder = object(
  {
    count: number,
    next: optional(string),
    previous: optional(string),
    results: resourcesDecoder,
  },
  "ResourceList"
);

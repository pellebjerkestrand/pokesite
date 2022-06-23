import { FromDecoder, JsonDecoder } from "ts.data.json";

import { get, GetOutcome } from "../../server/data";

const { array, number, object, optional, string } = JsonDecoder;

const resultDecoder = object(
  {
    name: string,
    url: string,
  },
  "Result"
);

const resultsDecoder = array(resultDecoder, "Results");

const resourceListDecoder = object(
  {
    count: number,
    next: optional(string),
    previous: optional(string),
    results: resultsDecoder,
  },
  "ResourceList"
);

export enum GetAllPokemonOutcome {
  failure = "failure",
  success = "success",
}

export const getAllPokemon = async (
  url: string = "https://pokeapi.co/api/v2/pokemon",
  collection: FromDecoder<typeof resultsDecoder> = []
): Promise<FromDecoder<typeof resultsDecoder>> => {
  const result = await get(url, resourceListDecoder);

  switch (result.outcome) {
    case GetOutcome.failure: {
      return [];
    }
    case GetOutcome.invalidKey: {
      return [];
    }
    case GetOutcome.success: {
      const collectedPokemon = collection.concat(result.value.results);

      if (result.value.next) {
        return getAllPokemon(result.value.next, collectedPokemon);
      }

      return collectedPokemon;
    }
  }
};

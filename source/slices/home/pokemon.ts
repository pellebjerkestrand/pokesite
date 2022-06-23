import { type FromDecoder } from "ts.data.json";

import { get, GetOutcome } from "../../server/data";
import { resultsDecoder, resourceListDecoder } from "./resource-list";

export enum GetAllPokemonOutcome {
  failure = "failure",
  success = "success",
}

type Collection = Record<string, FromDecoder<typeof resultsDecoder>>;

export const getAllPokemon = async (
  url: string = "https://pokeapi.co/api/v2/pokemon",
  collection: Collection = {}
): Promise<Collection> => {
  const result = await get(url, resourceListDecoder);

  switch (result.outcome) {
    case GetOutcome.failure: {
      return {};
    }
    case GetOutcome.invalidKey: {
      return {};
    }
    case GetOutcome.success: {
      collection[url] = result.value.results;

      if (result.value.next) {
        return getAllPokemon(result.value.next, collection);
      }

      return collection;
    }
  }
};

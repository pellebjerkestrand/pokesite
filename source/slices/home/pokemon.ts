import { JsonDecoder, type FromDecoder } from "ts.data.json";

import { get, getFromCache, GetOutcome, set } from "../../server/data";
import { resultsDecoder, resourceListDecoder } from "./resource-list";

export enum GetAllPokemonOutcome {
  failure = "failure",
  success = "success",
}

export enum PokemonSource {
  pageCache = "pageCache",
  pokeApi = "pokeApi",
}

const collectionDecoder = JsonDecoder.dictionary(resultsDecoder, "Collection");

type Collection = FromDecoder<typeof collectionDecoder>;

const cacheKey = "all-pokemon";

const getFreshPokemon = async (
  url: string = "https://pokeapi.co/api/v2/pokemon",
  collection: Collection = {}
): Promise<Collection | undefined> => {
  const result = await get(url, resourceListDecoder);

  switch (result.outcome) {
    case GetOutcome.failure:
    case GetOutcome.invalidKey: {
      return;
    }
    case GetOutcome.success: {
      collection[url] = result.value.results;

      if (result.value.next) {
        return getFreshPokemon(result.value.next, collection);
      }

      await set(cacheKey, collection);
      return collection;
    }
  }
};

const getCachedPokemon = async (): Promise<Collection | undefined> => {
  const result = await getFromCache(cacheKey, collectionDecoder);

  switch (result.outcome) {
    case GetOutcome.failure:
    case GetOutcome.invalidKey: {
      return;
    }
    case GetOutcome.success: {
      return result.value;
    }
  }
};

export const getAllPokemon = async (): Promise<
  | {
      outcome: GetAllPokemonOutcome.success;
      source: PokemonSource;
      value: Collection;
    }
  | {
      outcome: GetAllPokemonOutcome.failure;
    }
> => {
  const cachedPokemon = await getCachedPokemon();
  if (cachedPokemon) {
    return {
      outcome: GetAllPokemonOutcome.success,
      source: PokemonSource.pageCache,
      value: cachedPokemon,
    };
  }

  const freshPokemon = await getFreshPokemon();
  if (freshPokemon) {
    return {
      outcome: GetAllPokemonOutcome.success,
      source: PokemonSource.pageCache,
      value: freshPokemon,
    };
  }

  return { outcome: GetAllPokemonOutcome.failure };
};

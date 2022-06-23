import { JsonDecoder, type FromDecoder } from "ts.data.json";

import { get, GetOutcome } from "../../server/http";
import { read, ReadOutcome, write } from "../../server/cache";
import {
  resourcesDecoder,
  resourceListDecoder,
} from "../../server/resource-list-helpers";
import type { Home } from "./home.page";

const collectionDecoder = JsonDecoder.dictionary(
  resourcesDecoder,
  "Collection"
);

type Collection = FromDecoder<typeof collectionDecoder>;

const cacheKey = "all-pokemon";

const getFreshPokemon = async (
  url: string = "https://pokeapi.co/api/v2/pokemon",
  collection: Collection = {}
): Promise<Collection | undefined> => {
  const result = await get(url, resourceListDecoder);

  switch (result.outcome) {
    case GetOutcome.failure: {
      return;
    }
    case GetOutcome.success: {
      collection[url] = result.value.results;

      if (result.value.next) {
        return getFreshPokemon(result.value.next, collection);
      }

      await write(cacheKey, collection);
      return collection;
    }
  }
};

const getCachedPokemon = async (): Promise<Collection | undefined> => {
  const result = await read(cacheKey, collectionDecoder);

  switch (result.outcome) {
    case ReadOutcome.failure: {
      return;
    }
    case ReadOutcome.success: {
      return result.value;
    }
  }
};

type HomeProps = Parameters<typeof Home>[0];

const toHomeProps = (collection: Collection): HomeProps => ({
  title: "Pokémon",
  list: Object.values(collection).flatMap((list) =>
    list.map(({ name }) => name)
  ),
});

export enum GetAllPokemonOutcome {
  failure = "failure",
  success = "success",
}

export enum PokemonSource {
  pageCache = "pageCache",
  pokeApi = "pokeApi",
}

export const getProps = async (): Promise<
  | {
      outcome: GetAllPokemonOutcome.success;
      source: PokemonSource;
      value: HomeProps;
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
      value: toHomeProps(cachedPokemon),
    };
  }

  const freshPokemon = await getFreshPokemon();
  if (freshPokemon) {
    return {
      outcome: GetAllPokemonOutcome.success,
      source: PokemonSource.pageCache,
      value: toHomeProps(freshPokemon),
    };
  }

  return { outcome: GetAllPokemonOutcome.failure };
};

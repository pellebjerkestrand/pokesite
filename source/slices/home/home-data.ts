import { AsyncReturnType } from "type-fest";

import { get, GetOutcome } from "../../server/resource-list";
import { Namespace, read, ReadOutcome } from "../../server/cache";
import { homeCacheKey } from "./home-keys";
import { type HomeProps, homePropsDecoder } from "./home-props";

type ResourceLists = Record<
  string,
  Extract<AsyncReturnType<typeof get>, { outcome: GetOutcome.success }>["value"]
>;

const toHomeProps = (lists: ResourceLists): HomeProps => ({
  title: "Pokésite",
  list: Object.values(lists).flatMap((list) =>
    list.results.map(({ name }) => name)
  ),
});

const getPokemon = async (
  url: string = "https://pokeapi.co/api/v2/pokemon",
  lists: ResourceLists = {}
): Promise<ResourceLists | undefined> => {
  const result = await get(url);

  switch (result.outcome) {
    case GetOutcome.failure: {
      return;
    }
    case GetOutcome.success: {
      lists[url] = result.value;

      if (result.value.next) {
        return getPokemon(result.value.next, lists);
      }

      return lists;
    }
  }
};

const getCachedProps = async (): Promise<HomeProps | undefined> => {
  const result = await read(
    Namespace.pageProps,
    homeCacheKey,
    homePropsDecoder
  );

  switch (result.outcome) {
    case ReadOutcome.failure: {
      return;
    }
    case ReadOutcome.success: {
      return result.value;
    }
  }
};

export enum GetPropsOutcome {
  failure = "failure",
  success = "success",
}

export const getProps = async (): Promise<
  | {
      outcome: GetPropsOutcome.success;
      resources: string[];
      value: HomeProps;
    }
  | {
      outcome: GetPropsOutcome.failure;
    }
> => {
  const cachedProps = await getCachedProps();
  if (cachedProps) {
    return {
      outcome: GetPropsOutcome.success,
      resources: [],
      value: cachedProps,
    };
  }

  const pokemon = await getPokemon();
  if (pokemon) {
    return {
      outcome: GetPropsOutcome.success,
      resources: Object.keys(pokemon),
      value: toHomeProps(pokemon),
    };
  }

  return { outcome: GetPropsOutcome.failure };
};

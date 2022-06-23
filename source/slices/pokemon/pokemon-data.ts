import fetch from "node-fetch";
import { FromDecoder, JsonDecoder } from "ts.data.json";

import { Namespace, read, ReadOutcome } from "../../server/cache";
import { pokemonPropsCacheKey } from "./pokemon-keys";
import { type PokemonProps, pokemonPropsDecoder } from "./pokemon-props";

const { number, object, optional, string } = JsonDecoder;

/** Docs:
 *  https://pokeapi.co/docs/v2#pokemonsprites
 */
const spritesDecoder = object(
  {
    front_default: optional(string),
    front_shiny: optional(string),
    front_female: optional(string),
    front_shiny_female: optional(string),
    back_default: optional(string),
    back_shiny: optional(string),
    back_female: optional(string),
    back_shiny_female: optional(string),
  },
  "Sprites"
);

/** Docs:
 *  https://pokeapi.co/docs/v2#pokemon
 */
export const pokemonDecoder = object(
  {
    id: number,
    name: string,
    sprites: spritesDecoder,
  },
  "Pokémon"
);

const getCachedProps = async (
  name: string
): Promise<PokemonProps | undefined> => {
  const cachedProps = await read(
    Namespace.pageProps,
    pokemonPropsCacheKey(name),
    pokemonPropsDecoder
  );

  switch (cachedProps.outcome) {
    case ReadOutcome.failure: {
      return;
    }
    case ReadOutcome.success: {
      return cachedProps.value;
    }
  }
};

enum GetPokemonOutcome {
  failure = "failure",
  success = "success",
}

const getPokemon = async (
  name: string
): Promise<
  | {
      outcome: GetPokemonOutcome.failure;
    }
  | {
      outcome: GetPokemonOutcome.success;
      resource?: string;
      value: FromDecoder<typeof pokemonDecoder>;
    }
> => {
  const cachedResource = await read(
    Namespace.pokemonResource,
    name,
    pokemonDecoder
  );

  if (cachedResource.outcome === ReadOutcome.success) {
    return {
      outcome: GetPokemonOutcome.success,
      value: cachedResource.value,
    };
  }

  const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
  if (result.ok) {
    const decodedPokemon = pokemonDecoder.decode(await result.json());
    if (decodedPokemon.isOk()) {
      return {
        outcome: GetPokemonOutcome.success,
        resource: result.url,
        value: decodedPokemon.value,
      };
    }
  }

  return {
    outcome: GetPokemonOutcome.failure,
  };
};

const toPokemonProps = (
  pokemon: FromDecoder<typeof pokemonDecoder>
): PokemonProps => ({
  image:
    pokemon.sprites.front_shiny ??
    pokemon.sprites.front_female ??
    pokemon.sprites.front_default,
  name: pokemon.name,
  title: pokemon.name,
});

export enum GetPropsOutcome {
  failure = "failure",
  success = "success",
}

export const getProps = async (
  name: string
): Promise<
  | {
      outcome: GetPropsOutcome.failure;
    }
  | {
      outcome: GetPropsOutcome.success;
      resource?: string;
      value: PokemonProps;
    }
> => {
  const cachedProps = await getCachedProps(name);
  if (cachedProps) {
    return { outcome: GetPropsOutcome.success, value: cachedProps };
  }

  const pokemon = await getPokemon(name);
  if (pokemon.outcome === GetPokemonOutcome.success) {
    return {
      outcome: GetPropsOutcome.success,
      resource: pokemon.resource,
      value: toPokemonProps(pokemon.value),
    };
  }

  return {
    outcome: GetPropsOutcome.failure,
  };
};

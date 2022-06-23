import { type FromDecoder, JsonDecoder } from "ts.data.json";

const { object, optional, string } = JsonDecoder;

export const pokemonPropsDecoder = object(
  {
    image: optional(string),
    name: string,
    title: string,
  },
  "PokemonProps"
);

export type PokemonProps = FromDecoder<typeof pokemonPropsDecoder>;

import { type FromDecoder, JsonDecoder } from "ts.data.json";

const { object, string } = JsonDecoder;

export const pokemonPropsDecoder = object(
  {
    name: string,
    title: string,
  },
  "PokemonProps"
);

export type PokemonProps = FromDecoder<typeof pokemonPropsDecoder>;

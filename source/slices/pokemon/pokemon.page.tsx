import React from "react";

import { Title } from "../../components/title";

import type { PokemonProps } from "./pokemon-props";

export const Pokemon: React.FC<PokemonProps> = ({ image, name, title }) => (
  <main className="pokemon">
    <Title text={title} />
    {image ? <img alt={name} src={image} /> : null}
  </main>
);

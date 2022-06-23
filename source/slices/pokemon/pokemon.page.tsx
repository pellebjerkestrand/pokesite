import React from "react";

import { Title } from "../../components/title";

import type { PokemonProps } from "./pokemon-props";

export const Pokemon: React.FC<PokemonProps> = ({ title }) => (
  <main className="pokemon">
    <Title text={title} />
  </main>
);

import type { HtmlFunction } from "../../server/html-function.types";
import { renderHtml, RenderHtmlOutcome } from "../../server/render-html";
import { queueName } from "../../server/response-cache-queue-helpers";

import { getProps, GetAllPokemonOutcome, PokemonSource } from "./home.data";
import { Home } from "./home.page";

export const run: HtmlFunction = async (context) => {
  const pokemon = await getProps();

  if (pokemon.outcome === GetAllPokemonOutcome.failure) {
    return {
      body: "<p>Oh, dear. Something went wrong when getting Pokémon.</p>",
      headers: {
        "content-type": "text/html",
      },
      status: 500,
    };
  }

  if (pokemon.source === PokemonSource.pokeApi) {
    context.bindings[queueName] = Object.keys(pokemon.value);
  }

  const result = renderHtml(Home, "Pokémon", pokemon.value);

  switch (result.outcome) {
    case RenderHtmlOutcome.Failure: {
      return {
        body: "<p>Oh, dear. Something went wrong when rendering HTML.</p>",
        headers: {
          "content-type": "text/html",
        },
        status: 500,
      };
    }
    case RenderHtmlOutcome.Success: {
      return {
        body: result.value,
        headers: {
          "content-type": "text/html",
        },
      };
    }
  }
};

import type { HtmlFunction } from "../../server/html-function.types";

import { queueName } from "./response-cache-queue-helpers";
import { renderHtml, RenderHtmlOutcome } from "../../server/render-html";

import { Home } from "./home.page";
import { getAllPokemon } from "./pokemon";

export const run: HtmlFunction = async (context) => {
  const pokemon = await getAllPokemon();

  const result = renderHtml(Home, "Home", {
    list: Object.values(pokemon).flatMap((list) =>
      list.map(({ name }) => name)
    ),
    title: "Home",
  });

  context.bindings[queueName] = Object.keys(pokemon);

  switch (result.outcome) {
    case RenderHtmlOutcome.Failure: {
      return {
        body: "<p>Oh, dear.</p>",
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

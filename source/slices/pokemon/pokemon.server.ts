import { HtmlFunction } from "../../server/html-function.types";
import { renderHtml, RenderHtmlOutcome } from "../../server/render-html";
import { getProps, GetPropsOutcome } from "./pokemon-data";
import {
  pokemonPropsQueueName,
  pokemonResourceQueueName,
} from "./pokemon-keys";
import { toMessage } from "./pokemon-props-queue";
import { Pokemon } from "./pokemon.page";

export const run: HtmlFunction<{ name: string }> = async (context, request) => {
  const props = await getProps(request.params.name);

  if (props.outcome === GetPropsOutcome.failure) {
    return {
      body: "<p>Oh, dear. Something went wrong when getting the Pokémon.</p>",
      headers: {
        "content-type": "text/html",
      },
      status: 500,
    };
  }

  if (props.resource) {
    context.bindings[pokemonPropsQueueName] = toMessage({
      id: context.invocationId,
      props: props.value,
    });
    context.bindings[pokemonResourceQueueName] = props.resource;
  }

  const result = renderHtml(
    Pokemon,
    `Pokémon | ${request.params.name}`,
    props.value
  );

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

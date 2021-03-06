import type { HtmlFunction } from "../../azure-functions/html-function.types";
import { renderHtml, RenderHtmlOutcome } from "../../server/render-html";
import { queueName as resourceListQueueName } from "../../server/resource-list-queue-name";

import { getProps, GetPropsOutcome } from "./home-data";
import { homeQueueName } from "./home-keys";
import { toMessage } from "./home-queue";
import { Home } from "./home.page";

export const run: HtmlFunction = async (context) => {
  const props = await getProps();

  if (props.outcome === GetPropsOutcome.failure) {
    return {
      body: "<p>Oh, dear. Something went wrong when getting Pokémon.</p>",
      headers: {
        "content-type": "text/html",
      },
      status: 500,
    };
  }

  if (props.resources.length) {
    context.bindings[homeQueueName] = toMessage({
      id: context.invocationId,
      props: props.value,
    });
    context.bindings[resourceListQueueName] = props.resources;
  }

  const result = renderHtml(Home, "Pokésite", props.value);

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

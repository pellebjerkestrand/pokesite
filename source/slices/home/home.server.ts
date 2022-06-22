import type { HtmlFunction } from "../../server/html-function.types";

import { renderHtml, RenderHtmlOutcome } from "../../server/render-html";

import { Home } from "./home.page";

export const run: HtmlFunction = async () => {
  const result = renderHtml(Home, "Home", { title: "Home" });

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

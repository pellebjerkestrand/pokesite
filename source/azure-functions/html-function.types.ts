import type { HttpRequest } from "@azure/functions";

import type { HttpResponseBase, HttpContext } from "./http-trigger.types";

type HtmlResponse = HttpResponseBase & {
  body: string;
  headers: {
    [key: string]: string;
    "content-type": "text/html";
  };
};

/** **NB!** `Params` _must_ be ensured by the route.  */
export type HtmlFunction<
  Params extends HttpRequest["params"] = HttpRequest["params"]
> = (
  context: HttpContext & {
    req: HttpRequest & {
      params: Params;
    };
  },
  request: HttpRequest & {
    params: Params;
  }
) => Promise<HtmlResponse>;

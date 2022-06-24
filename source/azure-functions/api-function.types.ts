import type { HttpRequest } from "@azure/functions";
import type { JsonObject } from "type-fest";

import type { HttpResponseBase, HttpContext } from "./http-trigger.types";

type ApiResponse<T extends JsonObject> = HttpResponseBase & {
  body: T;
  headers: {
    [key: string]: string;
    "content-type": "application/json";
  };
};

/** **NB!** `Params` _must_ be ensured by the route.  */
export type ApiFunction<
  Response,
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
) => Promise<ApiResponse<Response>>;

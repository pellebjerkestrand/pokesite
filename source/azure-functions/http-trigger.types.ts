import type {
  Context,
  HttpRequest,
  HttpResponseSimple,
} from "@azure/functions";

export type HttpContext = Context & { req: HttpRequest };

export type HttpResponseBase = Pick<HttpResponseSimple, "cookies" | "status">;

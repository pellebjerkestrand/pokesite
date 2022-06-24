type HttpMethod =
  | "connect"
  | "delete"
  | "get"
  | "head"
  | "options"
  | "patch"
  | "post"
  | "put"
  | "trace"
  | "update";

export type HttpInBinding = {
  authLevel: "anonymous" | "function";
  direction: "in";
  methods: HttpMethod[];
  name: string;
  route: string;
  type: "httpTrigger";
};

const httpInBindingDefaults: Pick<
  HttpInBinding,
  "authLevel" | "direction" | "methods" | "name" | "type"
> = {
  authLevel: "anonymous",
  direction: "in",
  methods: ["get"],
  name: "req",
  type: "httpTrigger",
};

export const httpInBinding = (
  binding: Partial<HttpInBinding> & Pick<HttpInBinding, "route">
): HttpInBinding => Object.assign({}, httpInBindingDefaults, binding);

export type HttpOutBinding = {
  type: "http";
  direction: "out";
  name: string;
};

const httpOutBindingDefaults: HttpOutBinding = {
  type: "http",
  direction: "out",
  name: "$return",
};

export const httpOutBinding = (name?: string): HttpOutBinding =>
  name
    ? Object.assign({}, httpOutBindingDefaults, { name })
    : httpOutBindingDefaults;

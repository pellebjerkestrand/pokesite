import {
  type HttpBindings,
  httpInBinding,
  httpOutBinding,
} from "../../server/http-bindings";

export const bindings: HttpBindings = [
  httpInBinding({ route: "/" }),
  httpOutBinding(),
];

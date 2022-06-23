import type { Bindings } from "../../server/function-bindings.types";
import { httpInBinding, httpOutBinding } from "../../server/http-bindings";

export const bindings: Bindings = [
  httpInBinding({ route: "/static-files/{filename}" }),
  httpOutBinding(),
];

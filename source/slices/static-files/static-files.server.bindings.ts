import type { Bindings } from "../../azure-functions/function-bindings.types";
import {
  httpInBinding,
  httpOutBinding,
} from "../../azure-functions/http-bindings";

export const bindings: Bindings = [
  httpInBinding({ route: "/static-files/{filename}" }),
  httpOutBinding(),
];

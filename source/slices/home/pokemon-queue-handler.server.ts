import type { QueueHandlerFunction } from "../../server/queue-function.types";

export const run: QueueHandlerFunction = (context, message) => {
  console.debug(context.invocationId);
  console.debug(message);
};

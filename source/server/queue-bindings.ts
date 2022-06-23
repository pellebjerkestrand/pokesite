import { camelCase } from "camel-case";

type QueueBaseBinding<
  Direction = "in" | "out",
  Type = "queue" | "queueTrigger"
> = {
  connection: "AzureWebJobsStorage";
  direction: Direction;
  name: string;
  queueName: string;
  type: Type;
};

export type QueueInBinding = QueueBaseBinding<"in", "queueTrigger">;

export const queueInBinding = (name: string): QueueInBinding => {
  const sanitizedName = camelCase(name);

  return {
    type: "queueTrigger",
    direction: "in",
    name: sanitizedName,
    queueName: sanitizedName,
    connection: "AzureWebJobsStorage",
  };
};

export type QueueOutBinding = QueueBaseBinding<"out", "queue">;

export const queueOutBinding = (name: string): QueueOutBinding => {
  const sanitizedName = camelCase(name);

  return {
    type: "queue",
    direction: "out",
    name: sanitizedName,
    queueName: sanitizedName,
    connection: "AzureWebJobsStorage",
  };
};

import { camelCase } from "camel-case";
import { paramCase } from "param-case";

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

type QueueInBinding = QueueBaseBinding<"in", "queueTrigger">;

export const queueInBinding = (name: string): QueueInBinding => ({
  type: "queueTrigger",
  direction: "in",
  name: camelCase(name),
  queueName: paramCase(name),
  connection: "AzureWebJobsStorage",
});

type QueueOutBinding = QueueBaseBinding<"out", "queue">;

export const queueOutBinding = (name: string): QueueOutBinding => ({
  type: "queue",
  direction: "out",
  name: camelCase(name),
  queueName: paramCase(name),
  connection: "AzureWebJobsStorage",
});

export type QueueBindings = [QueueInBinding, QueueOutBinding];

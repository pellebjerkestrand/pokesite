import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";

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
  name: paramCase(name),
  queueName: pascalCase(name),
  connection: "AzureWebJobsStorage",
});

type QueueOutBinding = QueueBaseBinding<"out", "queue">;

export const queueOutBinding = (name: string): QueueOutBinding => ({
  type: "queue",
  direction: "out",
  name: paramCase(name),
  queueName: pascalCase(name),
  connection: "AzureWebJobsStorage",
});

export type QueueBindings = [QueueInBinding, QueueOutBinding];

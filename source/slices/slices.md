# Slices

First level directories in this directory:

- Are standalone slices
- Can be deleted to remove functionality completely
- Can be created to add functionality

Search for _Vertical Slice Architecture_ using your favorite search engine to learn more.

## Azure Functions

Azure Functions are split into bindings and implementations. Each must have a match of the other.

We have types for several kinds of functions and bindings, and define bindings in TypeScript (instead of JSON).

Files matching `*.api.ts` and `*.server.ts` are treated as implementations. Use of `api` and/or `server` is a preference, as they are treated the same way.

Files matching `*.bindings.ts` are treated as bindings. These files result in the JSON files that the runtime requires.

See [../azure-functions](../azure-functions) and [../azure-functions/azure-functions.md](../azure-functions/azure-functions.md) for more about the types and helpers for the Azure Functions runtime.

### API Function

Used for endpoints that return JSON and are meant to be used as an API by the client application.

Must be paired with HTTP bindings.

Typed responses and parameters are both supported.

```ts
export const bindings: Bindings = [
  httpInBinding({ route: "/api/hello/{name}" }),
  httpOutBinding(),
];
```

```ts
export const run: ApiFunction<
  { message: string },
  { name: string }
> = async () => {
  /* ... */
};
```

### HTML Function

Used for endpoints that return HTML and are meant to be used to render page components.

Typed parameters are supported.

Must be paired with HTTP bindings.

```ts
export const bindings: Bindings = [
  httpInBinding({ route: "/{name}" }),
  httpOutBinding(),
];
```

```ts
export const run: HtmlFunction<{ name: string }> = async () => {
  /* ... */
};
```

### File Function

Used for endpoints that return files. Must be paired with HTTP bindings.

```ts
export const bindings: Bindings = [
  httpInBinding({ route: "/static-files/{filename}" }),
  httpOutBinding(),
];
```

```ts
export const run: FileFunction = async () => {
  /* ... */
};
```

### Queue Functions

There is also support for binding to queues, in both directions.

#### In

```ts
export const bindings: Bindings = [queueInBinding("queueName")];
```

```ts
export const run: QueueHandlerFunction = async (_, message) => {
  /* ... */
};
```

#### Out

```ts
export const bindings: Bindings = [
  httpInBinding({ route }),
  httpOutBinding(),
  queueOutBinding(queueName),
];
```

```ts
export const run: HtmlFunction = async (context) => {
  /* ... */
  context.bindings[queueName] = message;
  /* ... */
};
```

## Styles

Sass files using the `.scss` file type are supported. If they exist in a slice, they will be included in the client build.

## Tests

See [../tests.md](../tests.md).

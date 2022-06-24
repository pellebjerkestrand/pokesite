# Pokésite

This is an example _Verticle Slice Architecture_ for a fullstack website on Azure Functions with React, Sass, and TypeScript.

There is documentation scattered around the codebase where it makes sense. If something is difficult or missing, feel free to make a PR.

## Get Started

```sh
# Make sure you are in ./source
cd source

# Make sure you have the correct Node.js version
nvm use

# Make sure you have a local settings file
npm run init

# A Redis URL needs to be the value of the REDIS setting
# redis[s]://[[username][:password]@][host][:port][/db-number]

# Get dependencies
npm ci

# Run the storage emulator in a separate terminal
npm run storage

# Build, watch, start server
npm run dev
```

See [`package.json`](./source/package.json) for more scripts.

## Source Divisions

It's probably a good idea to start with [slices](./source/slices/slices.md).

- [Azure Functions](./source/azure-functions/azure-functions.md)
- [Build](./source/build/build.md)
- [Client](./source/client/client.md)
- [Components](./source/components/components.md)
- [Server](./source/server/server.md)
- [Slices](./source/slices/slices.md)

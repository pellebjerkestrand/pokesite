# Source

This directory contains the source code to the entire application, including how to build it.

## Get Started

```sh
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

See [`package.json`](./package.json) for more scripts.

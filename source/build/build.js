const buildClient = require("./build-client");
const buildServer = require("./build-server");

const build = () => {
  const clientStart = process.hrtime.bigint();

  return buildClient()
    .finally((result) => {
      console.debug();
      console.debug(
        `⚡️ Client done in ${
          (process.hrtime.bigint() - clientStart) / BigInt(1000000)
        }ms`
      );

      return result;
    })
    .then((result) => {
      const serverStart = process.hrtime.bigint();

      return buildServer(result).finally(() =>
        console.debug(
          `⚡️ Server done in ${
            (process.hrtime.bigint() - serverStart) / BigInt(1000000)
          }ms`
        )
      );
    })
    .finally(() => {
      console.debug(
        `⚡️ Builds done in ${
          (process.hrtime.bigint() - clientStart) / BigInt(1000000)
        }ms`
      );
      console.debug();
    });
};

if (require.main === module) {
  build()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}

module.exports = build;

const esbuild = require("esbuild");
const fsp = require("fs").promises;
const glob = require("glob");
const path = require("path");
const util = require("util");
const distLocation = require("./dist-location");

const globp = util.promisify(glob);

const resolveEntryPoints = (globs) =>
  Promise.all(globs.map((g) => globp(path.resolve(__dirname, g)))).then(
    (groups) => groups.flat()
  );

const buildServer = () =>
  resolveEntryPoints(["../slices/*/*.api.ts", "../slices/*/*.server.ts"]).then(
    (entryPoints) =>
      esbuild.build({
        bundle: true,
        define: {
          "process.env.NODE_ENV": '"production"',
        },
        entryPoints,
        entryNames: "[name]",
        format: "cjs",
        logLevel: "error",
        outdir: path.resolve(__dirname, distLocation),
        platform: "node",
        sourcemap: false, // NOTE: The Azure Functions runtime doesn't read these
        target: ["node16"],
      })
  );

const copyFunctionsSettings = () =>
  fsp
    .mkdir(path.resolve(__dirname, distLocation), { recursive: true })
    .then(() =>
      Promise.all(
        ["host.json", "local.settings.json"].map((filename) =>
          fsp
            .copyFile(
              path.resolve(__dirname, `../${filename}`),
              path.resolve(__dirname, distLocation, filename)
            )
            .catch((error) => {
              if (error.code === "ENOENT") {
                return;
              }
              throw error;
            })
        )
      )
    );

const buildSpecs = () =>
  globp(path.resolve(__dirname, "../slices/*/*.bindings.ts"))
    .then((entryPoints) =>
      esbuild.build({
        bundle: true,
        entryNames: "[name]",
        entryPoints,
        format: "iife",
        globalName: "bindingsModule", // NOTE: This is a magic global that's used later
        logLevel: "error",
        outdir: path.resolve(__dirname, distLocation),
        platform: "node",
        sourcemap: false,
        target: ["node16"],
        write: false,
      })
    )
    .then((result) =>
      Promise.all(
        result.outputFiles.map((outputFile) => {
          // NOTE: Function folders can't have periods in them
          const outDir = outputFile.path
            .replace(".bindings.js", "")
            .replace(/\./g, "-");

          return fsp
            .mkdir(outDir, {
              recursive: true,
            })
            .then(() => {
              // NOTE: This seems dirty and it might be a candidate for an esbuild plugin.
              // It creates the magic global specified earlier in `globalName`
              eval(outputFile.text);

              return fsp.writeFile(
                path.resolve(outDir, "function.json"),
                JSON.stringify(
                  {
                    bindings: bindingsModule.bindings,
                    scriptFile: `../${path
                      .basename(outputFile.path)
                      .replace(".bindings", "")}`,
                  },
                  null,
                  2
                )
              );
            });
        })
      )
    );

const build = () =>
  Promise.all([buildServer(), buildSpecs(), copyFunctionsSettings()]);

if (require.main === module) {
  build()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}

module.exports = build;

const autoprefixer = require("autoprefixer");
const esbuild = require("esbuild");
const { default: importGlobPlugin } = require("esbuild-plugin-import-glob");
const manifestPlugin = require("esbuild-plugin-manifest");
const { sassPlugin } = require("esbuild-sass-plugin");
const fsp = require("fs").promises;
const glob = require("glob");
const path = require("path");
const postcss = require("postcss");
const util = require("util");
const distLocation = require("./dist-location");

const globp = util.promisify(glob);

const outdir = path.resolve(__dirname, distLocation, "static-files/public");

const build = () =>
  fsp
    .rm(outdir, { force: true, recursive: true })
    .then(() => fsp.mkdir(outdir, { recursive: true }))
    .then(() =>
      Promise.all([
        globp(path.resolve(__dirname, "../client/*.entry.ts")),
        globp(path.resolve(__dirname, "../components/*.scss")),
        globp(path.resolve(__dirname, "../slices/*/*.scss")),
      ]).then((paths) => paths.flat())
    )
    .then((entryPoints) =>
      esbuild.build({
        bundle: true,
        define: {
          "process.env.NODE_ENV": '"production"',
        },
        entryPoints,
        entryNames: "[name].[hash]",
        format: "iife",
        logLevel: "error",
        minify: true,
        outdir,
        platform: "browser",
        plugins: [
          manifestPlugin({
            // NOTE: This is always relative to `outdir`, which is stupid.
            filename: "../../../source/server/client-manifest.json",
            generate: (entries) =>
              Object.fromEntries(
                Object.entries(entries).map(([from, to]) => [
                  from,
                  `static-files/${path.basename(to)}`,
                ])
              ),
          }),
          importGlobPlugin(),
          sassPlugin({
            transform: async (source) => {
              const { css } = await postcss([autoprefixer]).process(source, {
                from: undefined,
              });
              return css;
            },
          }),
        ],
        sourcemap: "linked",
        target: ["chrome87", "firefox87", "safari12"],
      })
    );

if (require.main === module) {
  build()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}

module.exports = build;

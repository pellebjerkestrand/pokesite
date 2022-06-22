const fsp = require("fs").promises;
const path = require("path");

const outfile = path.resolve(__dirname, "../source/local.settings.json");

const init = () =>
  fsp
    .stat(outfile)
    .then(() => {
      console.error("You already have a settings file.");
      process.exitCode = 1;
      process.exit();
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        return;
      }
      throw error;
    })
    .then(() =>
      fsp.copyFile(
        path.resolve(__dirname, "example.local.settings.json"),
        outfile
      )
    )
    .then(() => console.log("Local settings file created."));

if (require.main === module) {
  init()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}

module.exports = init;

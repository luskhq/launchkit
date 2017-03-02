#! /usr/bin/env node

const cli = require("caporal");
const pkg = require("./package");
const main = require("./lib");

cli
  .version(pkg.version)
  .description(pkg.description)
  .argument("<config>", "Relative path to config file")
  .argument("<name>", "Name for which deploy config should be found")
  .action(main);

cli.parse(process.argv);

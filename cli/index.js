#! /usr/bin/env node

const cli = require("caporal");
const pkg = require("../package");
const deploy = require("./deploy-command");
const encrypt = require("./encrypt-command");
const decrypt = require("./decrypt-command");

cli.version(pkg.version).description(pkg.description);

cli
  .command("deploy", "Deploys the app")
  .argument("<config>", "Relative path to config file")
  .argument("<name>", "Name for which deploy config should be found")
  .action(deploy);

cli
  .command("encrypt", "Encrypts the config file")
  .argument("<source>", "Relative path to config to encrypt")
  .argument("<destination>", "Relative path to where to write encrypted config")
  .argument("<key>", "Encryption key")
  .action(encrypt);

cli
  .command("decrypt", "Decrypts the config file")
  .argument("<source>", "Relative path to encrypted config")
  .argument("<destination>", "Relative path to where to write decrypted config")
  .argument("<key>", "Decryption key")
  .action(decrypt);

cli.parse(process.argv);

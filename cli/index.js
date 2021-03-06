#! /usr/bin/env node

const cli = require("caporal");
const pkg = require("../package");
const deploy = require("./commands/deploy");
const encrypt = require("./commands/encrypt");
const view = require("./commands/view");
const decrypt = require("./commands/decrypt");
const update = require("./commands/update");
const remove = require("./commands/remove");
const protect = require("./commands/protect");

// prettier-ignore
cli
  .version(pkg.version)
  .description(pkg.description)

  .command("deploy", "Deploy app")
  .option("-c, --config <path>", "Override default config path", null, "launchkit.yml")
  .option("--key <value>", "Set decryption key inline (falls back to reading key from --key-file)", null, process.env.LAUNCHKIT_KEY)
  .option("--key-file <path>", "Override default key file path", null, ".key")
  .option("--yes", "Skip verification for protected envs")
  .argument("<env>", "Name of environment to use")
  .action(deploy)

  .command("encrypt", "Encrypts config file")
  .option("--key <value>", "Specify encryption key inline (falls back to reading key from --key-file)", null, process.env.LAUNCHKIT_KEY)
  .option("--key-file <path>", "Override default key file path", null, ".key")
  .option("--dest <destination>", "Relative path to where encrypted config file should be written", null, "launchkit.yml")
  .argument("<source>", "Relative path from where unecrypted config should be read")
  .action(encrypt)

  .command("decrypt", "Decrypts config file")
  .option("--key <value>", "Specify decryption key inline (falls back to reading key from --key-file)", null, process.env.LAUNCHKIT_KEY)
  .option("--key-file <path>", "Override default key file path", null, ".key")
  .option("--dest <destination>", "Relative path to where decrypted config file should be written", null, "launchkit.decrypted.yml")
  .argument("<source>", "Relative path from where ecrypted config should be read")
  .action(decrypt)

  .command("view", "Prints decrypted config (or specific env) to stdout")
  .option("-c, --config <path>", "Override default config path", null, "launchkit.yml")
  .option("--key <value>", "Specify decryption key inline (falls back to reading key from --key-file)", null, process.env.LAUNCHKIT_KEY)
  .option("--key-file <path>", "Override default key file path", null, ".key")
  .option("-d, --with-default", "Merge env with default")
  .argument("[env]", "Name of env to view")
  .action(view)

  .command("protect", "Indicates specfied env as protected")
  .option("-c, --config <path>", "Override default config path", null, "launchkit.yml")
  .argument("<env>", "Name of env for which to update keys")
  .action(protect)

  .command("update", "Updates and encrypts specified keys on config")
  .alias("add")
  .option("-c, --config <path>", "Override default config path", null, "launchkit.yml")
  .option("--key <value>", "Specify decryption key inline (falls back to reading key from --key-file)", null, process.env.LAUNCHKIT_KEY)
  .option("--key-file <path>", "Override default key file path", null, ".key")
  .argument("<env>", "Name of env for which to update keys")
  .argument("<pairs...>", "Key/value pairs to update. Supply as `path.to.key=value`")
  .action(update)

  .command("remove", "Removes specified keys from config")
  .option("-c, --config <path>", "Override default config path", null, "launchkit.yml")
  .argument("<env>", "Name of env from which to remove keys")
  .argument("<keys...>", "Keys to remove form env. Supply as `path.to.key`")
  .action(remove);

cli.parse(process.argv);

const R = require("ramda");
const U = require("../utils");
const YAML = require("js-yaml");
const { gray, yellow } = require("chalk");

// eslint-disable-next-line
const print = console.log;

const view = U.createCommand((args, options, logger) => {
  const key = U.getKey(options.key, options.keyFile);
  logger.debug(`Decryption key used: "${key}"`);

  const configPath = options.config;
  logger.debug("Config path: `%s`", configPath);

  const printEnv = R.curry((withoutDefault, name, config) => {
    if (name) {
      const targetEnv = withoutDefault
        ? config[name]
        : U.getMergedEnv(name, config);

      if (targetEnv) {
        print(gray(YAML.dump(targetEnv, { sortKeys: true })));
      } else {
        logger.warn(
          yellow("Nothing to view. Env `%s` not present in config.\n"),
          name
        );
      }
    } else {
      print(gray(YAML.dump(config, { sortKeys: true })));
    }
  });

  R.pipe(
    U.readConfig,
    U.decryptObject(key),
    printEnv(options.withoutDefault, args.env)
  )(configPath);
});

module.exports = view;

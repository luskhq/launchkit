const R = require("ramda");
const U = require("../utils");
const { gray, yellow } = require("chalk");

// eslint-disable-next-line
const print = console.log;

const view = U.createCommand((args, options, logger) => {
  const key = U.getKey(options.key, options.keyFile);
  logger.debug(`Decryption key used: "${key}"`);

  const configPath = options.config;
  logger.debug("Config path: `%s`", configPath);

  const printEnv = R.curry((withDefault, name, config) => {
    if (name) {
      const targetEnv = withDefault
        ? U.getMergedEnv(name, config)
        : config[name];

      if (targetEnv) {
        print(gray(U.dumpYAML(targetEnv)));
      } else {
        // prettier-ignore
        logger.warn(yellow("Nothing to view. Env `%s` not present in config."), name);
      }
    } else {
      print(gray(U.dumpYAML(config)));
    }
  });

  R.pipe(
    U.readConfig,
    U.decryptConfig(key),
    printEnv(options.withDefault, args.env)
  )(configPath);
});

module.exports = view;

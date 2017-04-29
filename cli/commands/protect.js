const R = require("ramda");
const U = require("../utils");
const { green } = require("chalk");

const protect = U.createCommand((args, options, logger) => {
  logger.debug(options);
  logger.debug(args);

  const { config: configPath } = options;
  const { env: envName } = args;

  R.pipe(
    U.readConfig,
    R.assocPath([envName, "protected"], true),
    U.writeYAML(configPath)
  )(configPath);

  logger.info(green("Success! The `%s` env is now protected."), envName);
});

module.exports = protect;

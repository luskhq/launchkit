const R = require("ramda");
const U = require("../utils");
const { green } = require("chalk");

const remove = U.createCommand((args, options, logger) => {
  const configPath = options.config;
  logger.debug("Config path: `%s`", configPath);

  const envName = args.env;
  logger.debug("Env name: `%s`", envName);

  const keys = args.keys;
  logger.debug("Keys name: `%j`", keys);

  const currentConfig = U.readConfig(configPath);

  const removeKeys = R.compose(
    R.reduce(R.flip(R.dissocPath), currentConfig),
    R.map(p => [envName, ...R.split(".", p)])
  );

  R.pipe(removeKeys, U.writeYAML(configPath))(keys);
  logger.info(green("Success! Config updated."));
});

module.exports = remove;

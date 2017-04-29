const R = require("ramda");
const { green, yellow } = require("chalk");
const createEncryptor = require("simple-encryptor");
const U = require("../utils");

const update = U.createCommand((args, options, logger) => {
  const key = U.getKey(options.key, options.keyFile);
  logger.debug("Decryption key used: `%s`", key);

  const configPath = options.config;
  logger.debug("Config path: `%s`", configPath);

  const envName = args.env;
  logger.debug("Env name: `%s`", envName);

  const pairs = args.pairs;
  logger.debug("Pairs are: `%j`", pairs);

  const currentConfig = U.readConfig(configPath);

  const encryptor = createEncryptor(key);
  const processPairs = R.compose(
    R.reduce((config, [path, value]) => {
      const lens = R.lensPath([envName, ...path]);
      const currentEncryptedValue = R.view(lens, config);
      const currentValue = encryptor.decrypt(currentEncryptedValue);

      if (currentValue === value) {
        logger.warn(
          yellow("Warning: `%s` key not updated. Value already is `%s`."),
          path.join("."),
          value
        );
        return config;
      }

      return R.set(lens, encryptor.encrypt(value), config);
    }, currentConfig),
    R.map(
      R.compose(([p, ...v]) => [R.split(".", p), R.join("=", v)], R.split("="))
    )
  );

  R.pipe(processPairs, U.writeYAML(configPath))(pairs);
  logger.info(green("Success! Config updated."));
});

module.exports = update;

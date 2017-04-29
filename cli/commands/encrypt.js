const R = require("ramda");
const U = require("../utils");
const { green } = require("chalk");

const encrypt = U.createCommand((args, options, logger) => {
  const key = U.getKey(options.key, options.keyFile);
  logger.debug("Encryption key used: `%s`", key);

  const dest = options.dest;
  logger.debug("Dest path: `%s`", key);

  R.pipe(U.readConfig, U.encryptConfig(key), U.writeYAML(dest))(args.source);
  logger.info(green("Success! Encrypted config written to `%s`"), dest);
});

module.exports = encrypt;

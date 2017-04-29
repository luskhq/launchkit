const now = require("../deployers/now");
const test = require("../deployers/test");
const U = require("../utils");
const R = require("ramda");

// Supported providers go here
const deployers = { now, test };

const loadDeployer = name => {
  const deployer = deployers[name];
  if (!deployer) {
    throw new Error(`Could not load deployer \`${name}\`.`);
  }

  return deployer;
};

const deploy = U.createCommand((args, options, logger) => {
  const key = U.getKey(options.key, options.keyFile);
  logger.debug("Decryption key used: `%s`", key);

  const configPath = options.config;
  logger.debug("Config path: `%s`", configPath);

  const envName = args.env;
  logger.debug("Env name: `%s`", envName);

  const performDeploy = env => {
    const deployerName = env.deployer;
    const deployer = loadDeployer(deployerName);
    deployer(env.options, logger);
  };

  R.pipe(
    U.readConfig,
    U.decryptObject(key),
    U.getMergedEnv(envName),
    performDeploy
  )(configPath);
});

module.exports = deploy;

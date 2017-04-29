const now = require("../deployers/now");
const { yellow } = require("chalk");
const test = require("../deployers/test");
const inquirer = require("inquirer");
const U = require("../utils");
const R = require("ramda");

// Supported providers go here
const deployers = { now, test };

const confirm = async message => {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: yellow(message),
      default: false,
    },
  ]);

  if (!confirmed) {
    process.exit(1);
  }
};

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

  const performDeploy = async config => {
    const env = U.getMergedEnv(envName, config);

    if (env.protected && !options.yes) {
      // prettier-ignore
      await confirm(`You're about to deploy a protected env \`${envName}\`. Are you sure?`);
    }

    if (envName === "default") {
      // prettier-ignore
      await confirm("You're about to deploy the default env. Generally, it is not recommended to use the default env for deploys. Do you want to proceed?");
    }

    const deployerName = env.deployer;
    const deployer = loadDeployer(deployerName);
    deployer(env.options, logger);
  };

  R.pipe(U.readConfig, U.decryptConfig(key), performDeploy)(configPath);
});

module.exports = deploy;

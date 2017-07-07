const R = require("ramda");
const childProcess = require("child_process");
const { green } = require("chalk");

const run = (...args) =>
  childProcess.execFileSync(...args, { encoding: "utf8" });

const envVars = R.compose(
  R.chain(([key, value]) => ["--env", `${key}=${value}`]),
  R.toPairs
);

const deploy = (token, vars) =>
  run("now", [
    "--force",
    "--token",
    token,
    ...envVars(vars),
    "--no-clipboard",
    "deploy",
  ]);

const alias = (token, fromURL, toURL) =>
  run("now", ["--token", token, "alias", fromURL, toURL]);

const now = (options, logger) => {
  logger.info("Deploying to ▲ now...");

  const deployURL = deploy(options.token, options.vars).trim();
  alias(options.token, deployURL, options.alias);

  logger.info(green("Success! Deployed to %s (%s)"), deployURL, options.alias);
};

module.exports = now;

const R = require("ramda");
const mustache = require("mustache");

/* local utils */

const envVars = R.compose(
  R.chain(([key, value]) => ["--env", `${key}=${value}`]),
  R.toPairs
);

/* shell commands */

const deploy = (token, vars) => {
  console.log(
    "now",
    [
      "--force",
      "--token",
      token,
      ...envVars(vars),
      "--no-clipboard",
      "deploy",
    ].join(" ")
  );

  return "https://some-deploy-url.com";
};

const alias = (token, fromURL, toURL) =>
  console.log("now", ["--token", token, "alias", fromURL, toURL].join(" "));

/* now provider handler */

const test = (options, logger) => {
  logger.info("Using the test deployer");

  const aliasURL = mustache.render(options.alias, process.env);
  const deployURL = deploy(options.token, options.vars).trim();
  alias(options.token, deployURL, aliasURL);

  logger.info(`Deployed to ${deployURL} (${aliasURL})`);
};

module.exports = test;

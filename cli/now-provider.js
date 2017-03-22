const mustache = require("mustache");
const ramda = require("ramda");
const lib = require("./lib");

/* local utils */

const envVars = ramda.compose(
  ramda.chain(([key, value]) => [`--env`, `${key}=${value}`]),
  ramda.toPairs
);

/* shell commands */

const deploy = (token, vars) =>
  lib.run("now", [
    "--force",
    "--token",
    token,
    ...envVars(vars),
    "--no-clipboard",
    "deploy"
  ]);

const alias = (token, fromURL, toURL) =>
  lib.run("now", ["--token", token, "alias", fromURL, toURL]);

/* now provider handler */

const now = config => {
  lib.log("Deploying to ▲ now...");

  const aliasURL = mustache.render(config.alias, process.env);
  const deployURL = deploy(config.token, config.vars).trim();
  alias(config.token, deployURL, aliasURL);

  lib.log(`Deployed to ${deployURL} (${aliasURL})`);
};

module.exports = now;

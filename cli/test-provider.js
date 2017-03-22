const mustache = require("mustache");
const ramda = require("ramda");
const lib = require("./lib");

/* local utils */

const envVars = ramda.compose(
  ramda.chain(([key, value]) => [`--env`, `${key}=${value}`]),
  ramda.toPairs
);

/* shell commands */

const deploy = (token, vars) => {
  lib.log(
    "now",
    [
      "--force",
      "--token",
      token,
      ...envVars(vars),
      "--no-clipboard",
      "deploy"
    ].join(" ")
  );

  return "https://some-deploy-url.com";
};

const alias = (token, fromURL, toURL) =>
  lib.log("now", ["--token", token, "alias", fromURL, toURL].join(" "));

/* now provider handler */

const test = config => {
  lib.log("Using the test provider");

  const aliasURL = mustache.render(config.alias, process.env);
  const deployURL = deploy(config.token, config.vars).trim();
  alias(config.token, deployURL, aliasURL);

  lib.log(`Deployed to ${deployURL} (${aliasURL})`);
};

module.exports = test;

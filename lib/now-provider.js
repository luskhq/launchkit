const mustache = require("mustache");
const ramda = require("ramda");
const utils = require("./utils");

/* local utils */

const prepEnvVarArgs = ramda.compose(
  ramda.chain(([key, value]) => [`-e`, `${key}=${value}`]),
  ramda.toPairs
);

/* shell commands */

const deploy = (token, vars) =>
  utils.run("now", [
    "-C",
    "-f",
    "-t",
    token,
    ...prepEnvVarArgs(vars),
    "deploy"
  ]);

const alias = (token, fromURL, toURL) =>
  utils.run("now", ["-t", token, "alias", fromURL, toURL]);

const version = () => utils.run("now", ["-v"]);

const install = () => utils.run("npm", ["install", "now"]);

/* now provider handler */

const now = (vars, config) => {
  utils.log("Deploying to ▲ now...");

  try {
    // Check if `now-cli` is installed.
    const v = version();
    utils.log(`Using now-cli version ${v}`);
  } catch (error) {
    // Since `now-cli` errored-out, it's probably not installed. Let's get it then.
    utils.log("now-cli not installed. Installing...");
    install();
    const v = version();
    utils.log(`Using now-cli version ${v}`);
  }

  const aliasURL = mustache.render(config.alias, process.env);
  const deployURL = deploy(config.token, vars).trim();
  alias(config.token, deployURL, aliasURL);

  utils.log(`Deployed to ${deployURL} (${aliasURL})`);
};

module.exports = now;

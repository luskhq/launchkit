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
  const deployURL = deploy(options.token, options.vars).trim();

  if (Array.isArray(options.alias)) {
    const aliasURLs = options.alias.map(a => mustache.render(a, process.env));
    aliasURLs.forEach(aliasURL => alias(options.token, deployURL, aliasURL));
    logger.info(
      "Success! Deployed to %s (%s)",
      deployURL,
      aliasURLs.join(", ")
    );
  } else {
    const aliasURL = mustache.render(options.alias, process.env);
    alias(options.token, deployURL, aliasURL);
    logger.info("Success! Deployed to %s (%s)", deployURL, aliasURL);
  }
};

module.exports = test;

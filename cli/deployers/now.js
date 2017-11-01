const R = require("ramda");
const mustache = require("mustache");
const childProcess = require("child_process");
const { green } = require("chalk");

const run = (...args) =>
  childProcess.execFileSync(...args, { encoding: "utf8" });

const envVars = R.compose(
  R.chain(([key, value]) => ["--env", `${key}=${value}`]),
  R.toPairs
);

const deploy = (token, vars) =>
  run("now", ["--token", token, ...envVars(vars), "--no-clipboard", "deploy"]);

const alias = (token, fromURL, toURL) =>
  run("now", ["--token", token, "alias", fromURL, toURL]);

const now = (options, logger) => {
  logger.info("Deploying to ▲ now...");

  const deployURL = deploy(options.token, options.vars).trim();

  options.vars = R.map(val => mustache.render(val, process.env), options.vars);

  console.log(options);
  if (Array.isArray(options.alias)) {
    const aliasURLs = options.alias.map(a => mustache.render(a, process.env));
    aliasURLs.forEach(aliasURL => alias(options.token, deployURL, aliasURL));
    logger.info(
      green("Success! Deployed to %s (%s)"),
      deployURL,
      aliasURLs.join(", ")
    );
  } else {
    const aliasURL = mustache.render(options.alias, process.env);
    alias(options.token, deployURL, aliasURL);
    logger.info(green("Success! Deployed to %s (%s)"), deployURL, aliasURL);
  }
};

module.exports = now;

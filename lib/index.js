const now = require("./now-provider");
const getConfig = require("./get-config");
const utils = require("./utils");

// Supported providers go here
const providers = { now };

/* main CLI handler */

const main = ({ config: configPath, name }) => {
  const { provider, vars, config } = getConfig(configPath, name);
  const deploy = providers[provider];
  if (!deploy) {
    const providerNames = Object.keys(providers)
      .map(key => `"${key}"`)
      .join(", ");

    utils.exit(
      `Invalid provider "${provider}". Supported providers are ${providerNames}`
    );
  }
  deploy(vars, config);
};

module.exports = main;

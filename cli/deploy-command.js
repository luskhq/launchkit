const now = require("./now-provider");
const test = require("./test-provider");
const lib = require("./lib");

// Supported providers go here
const providers = { now, test };

const deploy = ({ config: configPath, name }) => {
  const { provider, config } = lib.getConfig(configPath, name);
  const deploy = providers[provider];

  // Bail if no provier is known.
  if (!deploy) {
    const providerNames = Object.keys(providers)
      .map(key => `"${key}"`)
      .join(", ");
    lib.exit(
      `Invalid provider "${provider}". Supported providers are ${providerNames}`
    );
  }

  // Otherwise deploy!
  deploy(config);
};

module.exports = deploy;

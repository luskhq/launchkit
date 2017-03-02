const fs = require("fs");
const path = require("path");
const deepmerge = require("deepmerge");
const utils = require("./utils");

const getConfig = (configPath, name) => {
  // Try loading config file
  let configFile;
  try {
    const absoluteConfigPath = path.resolve(configPath);
    configFile = fs.readFileSync(absoluteConfigPath, {
      encoding: "utf8"
    });
  } catch (error) {
    utils.exit("Couldn't load config from supplied path", error);
  }

  // Try parsing the config file
  let config;
  try {
    config = JSON.parse(configFile);
  } catch (error) {
    utils.exit("Couldn't parse config file", error);
  }

  utils.log(`Loaded config from "${configPath}"...`);

  const targetConfig = config[name];
  const defaultConfig = config.__default;

  if (!targetConfig) {
    utils.log(`Config for "${name}" not found. Using "default".`);
    return defaultConfig;
  }

  return deepmerge(defaultConfig, targetConfig);
};

module.exports = getConfig;

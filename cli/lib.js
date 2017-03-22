const Ramda = require("ramda");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const deepmerge = require("deepmerge");

// eslint-disable-next-line
const log = console.log;

// eslint-disable-next-line
const logError = console.error;

const run = (...args) =>
  childProcess.execFileSync(...args, { encoding: "utf8" });

const exit = (message, error) => {
  logError(message);
  if (error) {
    logError();
    logError(error);
  }
  process.exit(1);
};

const writeObjToFile = (destPath, obj) => {
  const file = fs.writeFileSync(
    path.resolve(destPath),
    JSON.stringify(obj, null, 2) + "\n"
  );
  log(`File written to ${destPath}`);
  return file;
};

const processObjectValues = Ramda.curry((cb, obj) => {
  for (const prop in obj) {
    const value = obj[prop];
    switch (typeof value) {
      case "string":
        const newValue = cb(value);
        if (newValue === null) {
          exit("Couldn't process value. Returned null.");
        }
        obj[prop] = newValue;
        break;
      case "object":
        obj[prop] = processObjectValues(cb, value);
        break;
      default:
        exit(`Cannot process value. Unsupported type "${typeof value}"`);
    }
  }

  return obj;
});

const loadConfig = relativePath => {
  try {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const configFile = fs.readFileSync(absolutePath, { encoding: "utf8" });
    log(`Loaded config from "${relativePath}"...`);
    return configFile;
  } catch (error) {
    exit("Couldn't load config from supplied path", error);
  }
};

const parseConfig = configFile => {
  try {
    return JSON.parse(configFile);
  } catch (error) {
    exit("Couldn't parse config file", error);
  }
};

const mergeConfig = (target, config) => {
  const targetConfig = config[target];
  const defaultConfig = config._default;

  if (!targetConfig && !defaultConfig) {
    log("No configs provided");
    return null;
  }

  if (!targetConfig) {
    log(`Config for "${target}" not found. Using default.`);
    return defaultConfig;
  }

  return deepmerge(defaultConfig, targetConfig);
};

const getConfig = (configPath, name) => {
  // Try loading config file
  const configFile = loadConfig(configPath);

  // Try parsing the config file
  const config = parseConfig(configFile);

  // Return target config deeply merged with default
  const finalConfig = mergeConfig(name, config);
  return finalConfig;
};

module.exports = {
  exit,
  log,
  run,
  writeObjToFile,
  processObjectValues,
  loadConfig,
  parseConfig,
  mergeConfig,
  getConfig
};

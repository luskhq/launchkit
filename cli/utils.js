const fs = require("fs");
const path = require("path");
const R = require("ramda");
const YAML = require("js-yaml");
const chalk = require("chalk");
const createEncryptor = require("simple-encryptor");
const deepmerge = require("deepmerge");

const readTextFile = relativePath => {
  const absolutePath = path.resolve(relativePath);
  return fs.readFileSync(absolutePath, { encoding: "utf8" });
};

const writeObject = R.curry((relativePath, obj) => {
  const absolutePath = path.resolve(relativePath);
  fs.writeFileSync(
    absolutePath,
    YAML.dump(obj, { lineWidth: Infinity, sortKeys: true })
  );
});

const readConfig = R.compose(YAML.load, readTextFile);

const getKey = (key, keyFilePath) => {
  if (key) return key;
  return readTextFile(keyFilePath).trim();
};

const processObject = R.curry((cb, obj) => {
  for (const prop in obj) {
    const value = obj[prop];

    switch (typeof value) {
      case "string":
        const newValue = cb(value);
        if (newValue === null) {
          throw new Error(
            `Object value for prop \`${prop}\` returned null. This probably means your encryption key is wrong.`
          );
        }
        obj[prop] = newValue;
        break;
      case "object":
        obj[prop] = processObject(cb, value);
        break;
      default:
        throw new Error(
          `Unsupported type \`${typeof value}\` in object. Config object must only contain objects and strings.`
        );
    }
  }

  return obj;
});

const decryptObject = key => {
  const encryptor = createEncryptor(key);
  return processObject(value => encryptor.decrypt(value));
};

const encryptObject = key => {
  const encryptor = createEncryptor(key);
  return processObject(value => encryptor.encrypt(value));
};

const createCommand = cb => (args, options, logger) => {
  try {
    cb(args, options, logger);
  } catch (error) {
    logger.error(chalk.red("Failed. " + error.message) + "\n");
    logger.debug(error);
    process.exit(1);
  }
};

const getMergedEnv = R.curry((name, config) => {
  const targetEnv = config[name];
  const defaultEnv = config._default;

  if (!targetEnv) {
    return defaultEnv;
  }

  return deepmerge(defaultEnv, targetEnv);
});

module.exports = {
  getKey,
  readConfig,
  processObject,
  writeObject,
  createCommand,
  decryptObject,
  encryptObject,
  getMergedEnv,
};

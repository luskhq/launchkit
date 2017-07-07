const fs = require("fs");
const mustache = require("mustache");
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

const dumpYAML = input => YAML.dump(input, { sortKeys: true });

const writeYAML = R.curry((relativePath, input) => {
  const absolutePath = path.resolve(relativePath);
  fs.writeFileSync(
    absolutePath,
    YAML.dump(input, { lineWidth: Infinity, sortKeys: true })
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
        const newValue = cb(value, prop);
        obj[prop] = newValue;
        break;
      case "boolean":
        // Do nothing with boolean values...
        break;
      case "object":
        obj[prop] = processObject(cb, value);
        break;
      default:
        throw new Error(
          `Unsupported type \`${typeof value}\` in object. Config object must only contain objects, strings, and booleans.`
        );
    }
  }

  return obj;
});

const decryptObject = R.curry((key, obj) => {
  const encryptor = createEncryptor(key);
  const decrypt = (value, prop) => {
    const decrypted = encryptor.decrypt(value);
    //prettier-ignore
    if (decrypted === null)
      throw new Error(`Failed to decrypt \`${prop}\`. This probably means your encryption key is wrong.`);

    return decrypted;
  };

  return processObject(decrypt, obj);
});

const encryptObject = R.curry((key, obj) => {
  const encryptor = createEncryptor(key);
  return processObject(value => encryptor.encrypt(value), obj);
});

const renderObject = R.curry((context, obj) => {
  const render = (value, prop) => {
    return mustache.render(value, context);
  };

  return processObject(render, obj);
});

const decryptConfig = decryptObject;

const encryptConfig = encryptObject;

const renderConfig = renderObject;

const createCommand = cb => (args, options, logger) => {
  try {
    cb(args, options, logger);
  } catch (error) {
    logger.error(chalk.red("Failed. " + error.message) + "\n");
    logger.debug(error);
    process.exit(1);
  }
};

const getMergedEnv = R.curry((name, envs) => {
  const targetEnv = envs[name];
  const defaultEnv = envs.default;

  if (!targetEnv) {
    return defaultEnv;
  }

  return deepmerge(defaultEnv, targetEnv);
});

module.exports = {
  getKey,
  readConfig,
  processObject,
  writeYAML,
  createCommand,
  decryptConfig,
  encryptConfig,
  renderConfig,
  getMergedEnv,
  dumpYAML
};

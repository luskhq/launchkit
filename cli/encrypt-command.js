const Ramda = require("ramda");
const makeEncryptor = require("simple-encryptor");
const lib = require("./lib");

const encrypt = ({ source: sourcePath, destination: destPath, key }) => {
  const encryptor = makeEncryptor(key);

  const encryptConfig = Ramda.compose(
    lib.processObjectValues(value => encryptor.encrypt(value)),
    lib.parseConfig,
    lib.loadConfig
  );

  const encryptedConfig = encryptConfig(sourcePath);

  lib.writeObjToFile(destPath, encryptedConfig);
};

module.exports = encrypt;

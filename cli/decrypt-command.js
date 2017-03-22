const Ramda = require("ramda");
const makeEncryptor = require("simple-encryptor");
const lib = require("./lib");

const decrypt = ({ source: sourcePath, destination: destPath, key }) => {
  const encryptor = makeEncryptor(key);

  const decryptConfig = Ramda.compose(
    lib.processObjectValues(value => encryptor.decrypt(value)),
    lib.parseConfig,
    lib.loadConfig
  );

  const decryptedConfig = decryptConfig(sourcePath);

  lib.writeObjToFile(destPath, decryptedConfig);
};

module.exports = decrypt;

const execFileSync = require("child_process").execFileSync;

const run = (...args) => execFileSync(...args, { encoding: "utf8" });

const exit = (message, error) => {
  console.error(message);
  if (error) {
    console.error();
    console.error(error);
  }
  process.exit(1);
};

const log = console.log;

module.exports = { exit, log, run };

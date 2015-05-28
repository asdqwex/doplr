"use strict";

module.exports = function (options) {
  // Logging (should probably use winston here)
  const logger = function () {
    if (!options.silent) { console.log.apply(console, arguments); }
  };
  logger.info = function () {
    if (options.verbose) { console.log.apply(console, arguments); }
  };
  logger.debug = function () {
    if (options.verbose > 1) { console.log.apply(console, arguments); }
  };
  return logger;
};

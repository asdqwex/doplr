"use strict";

module.exports = function (options) {
  // Logging (should probably use winston here)
  return {
    warn: function () {
      if (!options.silent) { console.log.apply(console, arguments); }
    },
    info: function () {
      if (options.verbose) { console.log.apply(console, arguments); }
    },
    debug: function () {
      if (options.verbose > 1) { console.log.apply(console, arguments); }
    }
  };
};

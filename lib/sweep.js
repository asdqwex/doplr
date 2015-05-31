"use strict";

module.exports = function DoplrSweepFactory (doplr) {

  return class DoplrSweep {

    constructor (options) {
      this.options = options;
      this.plugins = {};
    }

    begin () {
      doplr.log.debug("Sweep begin");
    }
  };
};

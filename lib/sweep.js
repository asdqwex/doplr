"use strict";

module.exports = function DoplrSweepFactory (doplr) {

  return class DoplrSweep {

    constructor (options) {
      doplr.log(options.targetUri);
    }

    begin () {

    }
  };
};

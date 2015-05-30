"use strict";

module.exports = function DoplrSweepFactory (doplr) {

  return class DoplrSweep {

    constructor (options) {
      doplr.log(options.targetUri);
      // Append this to our own sweep instance
      this.targetUri = options.targetUri;
    }

    begin () {
      doplr.log(this.targetUri);
    }
  };
};

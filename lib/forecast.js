"use strict";

const CONSTANTS = require("./constants");

module.exports = function DoplrForecastFactory (doplr) {

  return class DoplrForecast {

    constructor (options) {
      this.options = options;
      doplr.log(CONSTANTS.UNIMPLIMENTED);
    }

    report () {

    }
  };
};

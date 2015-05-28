"use strict";

const CONSTANTS = require("./constants");

module.exports = function DoplrForecastFactory (doplr) {

  return class DoplrForecast {

    constructor () {
      doplr.log(CONSTANTS.UNIMPLIMENTED);
    }

    report () {

    }
  };
};

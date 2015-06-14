'use strict';

// const CONSTANTS = require('./constants');

module.exports = function DoplrForecastFactory (doplr) {

  return class DoplrForecast {

    constructor (options) {
      doplr.log.debug('new Forecast', options);
      this.options = options;
    }

    report () {

    }
  };
};

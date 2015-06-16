'use strict';

module.exports = function ForecastFactory (helpers) {

  return class Forecast {

    constructor (options) {
      this.log = helpers.logger(options);

      this.log.debug('new Forecast', options);
      this.options = options;
    }

    report () {

    }
  };
};

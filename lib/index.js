'use strict';
// Doplr - The infrastructure discovery toolkit

const SweepFactory = require('./sweep');
const ForecastFactory = require('./forecast');
const RadarFactory = require('./radar');

module.exports = class Doplr {
  constructor (options) {
    this.forecastPath = options.targetForecast;
    this.log = require('./../lib/logger')(options);

    this.Sweep = new SweepFactory(this);
    this.Forecast = new ForecastFactory(this);
    this.Radar = new RadarFactory(this);
  }
};

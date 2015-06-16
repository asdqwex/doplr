'use strict';
// Doplr - The infrastructure discovery toolkit

const SweepFactory = require('./sweep');
const ForecastFactory = require('./forecast');
const RadarFactory = require('./radar');
const CONSTANTS = require('./constants');
const Doplr = {};

const helpers = {
  logger: require('./../lib/logger'),
  CONSTANTS: CONSTANTS
};

Doplr.CONSTANTS = CONSTANTS;
Doplr.Sweep = new SweepFactory(helpers);
Doplr.Forecast = new ForecastFactory(helpers);
Doplr.Radar = new RadarFactory(helpers);

module.exports = Doplr;

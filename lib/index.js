"use strict";
// Doplr - The streaming infrastructure monitoring and discovery toolkit

const SweepFactory = require("./sweep");
const ForecastFactory = require("./forecast");
const RadarFactory = require("./radar");

module.exports = class Doplr {
  constructor (options) {
    this.forecastPath = options.targetForecast;
    this.verbose = options.verbose;
    this.log = require("./../lib/logger")(options);

    this.Sweep = new SweepFactory(this);
    this.Forecast = new ForecastFactory(this);
    this.Radar = new RadarFactory(this);
  }
};

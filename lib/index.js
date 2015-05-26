"use strict";
// Doplr - The streaming infrastructure monitoring and discovery toolkit

// const CONSTANTS = require("./constants");

const SweepFactory = require("./sweep");
const ForecastFactory = require("./forecast");
const WeatherGirlFactory = require("./weathergirl");

module.exports = class Doplr {
  constructor (options) {
    this.forecastPath = options.targetForecast;
    this.verbose = options.verbose;

    this.Sweep = new SweepFactory();
    this.Forecast = new ForecastFactory();
    this.WeatherGirl = new WeatherGirlFactory();
  }
};

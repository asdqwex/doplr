"use strict";

module.exports = {
  // The default string name of the database we'll create
  DEFAULT_FORECAST_DIRECTORY: ".forecast",
  // The default port for weathergirl
  DEFAULT_WEATHERGIRLPORT: 90210,
  // The default port for the Forecast API
  DEFAULT_FORECASTPORT: 90404,
  // Default URI that --radar will assume
  DEFAULT_RADARURI: "localhost:8079",
  // An error string when a function hasn't been written yet
  UNIMPLIMENTED: "Not yet supported",
  // Help text for `doplr radar`
  RADAR_USAGE: `"doplr radar" must be called with one of "start|stop"`
};
